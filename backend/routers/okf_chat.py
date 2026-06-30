import os
import re
import glob
from collections import Counter
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sambanova import SambaNova
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/okf", tags=["OKF Chat"])

SAMBANOVA_API_KEY = os.environ.get("SAMBANOVA_API_KEY")
MODEL_NAME = "DeepSeek-V3.1"

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# Initialize SambaNova Client
client = None
if SAMBANOVA_API_KEY:
    try:
        client = SambaNova(
            api_key=SAMBANOVA_API_KEY,
            base_url="https://api.sambanova.ai/v1",
        )
    except Exception as e:
        print(f"Warning: Failed to initialize SambaNova client: {e}")

gemini_client = None
if GOOGLE_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client: {e}")

class OKFKnowledgeBase:
    def __init__(self, directory_path):
        self.directory_path = directory_path
        self.documents = {}
        self.load_documents()

    def load_documents(self):
        """Loads all markdown files from the OKF directory."""
        if not os.path.exists(self.directory_path):
            print(f"Warning: OKF Directory '{self.directory_path}' not found.")
            return

        filepaths = glob.glob(os.path.join(self.directory_path, "*.md"))
        for filepath in filepaths:
            filename = os.path.basename(filepath)
            with open(filepath, "r", encoding="utf-8") as f:
                self.documents[filename] = f.read()
        print(f"Successfully loaded {len(self.documents)} OKF concepts.")

    def get_relevant_context(self, user_query, top_k=4):
        """Finds the most relevant OKF files based on word overlap."""
        query_words = set(re.findall(r'\w+', user_query.lower()))
        scores = {}

        for filename, content in self.documents.items():
            doc_words = re.findall(r'\w+', content.lower())
            doc_word_counts = Counter(doc_words)
            score = sum(doc_word_counts[word] for word in query_words if word in doc_word_counts)
            scores[filename] = score

        ranked_docs = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        
        relevant_texts = []
        for filename, score in ranked_docs[:top_k]:
            if score > 0:
                relevant_texts.append(f"--- SOURCE: {filename} ---\n{self.documents[filename]}")
                
        return "\n\n".join(relevant_texts)

# Construct absolute path to the okf_knowledge_base directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
okf_dir = os.path.join(base_dir, "okf_knowledge_base")
kb = OKFKnowledgeBase(okf_dir)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    user_name: str = "Farmer"
    language: str = "en"

class ChatResponse(BaseModel):
    reply: str
    sources: List[str]

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not client and not gemini_client:
        raise HTTPException(status_code=500, detail="No AI API Keys configured in .env")
        
    try:
        user_query = request.message
        
        # 1. Retrieve context
        context_data = kb.get_relevant_context(user_query, top_k=5)
        
        # 2. Package context with query
        augmented_prompt = f"USER QUERY: {user_query}\n\n"
        if context_data:
            augmented_prompt += f"RELEVANT OKF CONTEXT:\n{context_data}"
        
        # 3. Assemble chat history messages
        system_prompt = (
            f"You are KisanSeva's AI Farmer Guide, an expert in all agricultural matters.\n"
            f"The user's name is {request.user_name}.\n"
            "Provide highly accurate, actionable, and comprehensive agricultural advice.\n\n"
            "CRITICAL RULES:\n"
            "1. Be concise, precise, and directly answer the farmer's question.\n"
            f"2. If the user greets you, respond with a polite, brief greeting using their name (e.g. 'Hello {request.user_name}! How can I help you with your farm today?').\n"
            "3. Use the provided context to answer if relevant. If the context does not contain the answer, seamlessly answer using your vast general agricultural knowledge.\n"
            "4. NEVER mention 'OKF', 'database', 'context', or 'provided information' in your response.\n"
            "5. If asking about a disease/pest, prioritize organic methods first, then chemical.\n"
            "6. You can answer ANY question related to farming, crops, weather, soils, livestock, or market prices.\n"
            "7. Format cleanly with Markdown (bullet points, bolding). Keep paragraphs short.\n"
            f"8. IMPORTANT: You MUST respond entirely in the language corresponding to this code: {request.language} (e.g. 'hi' for Hindi, 'mr' for Marathi, 'en' for English)."
        )
        
        assistant_reply = None
        
        if gemini_client:
            try:
                contents = []
                for msg in request.history:
                    role = "user" if msg.role == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role, 
                            parts=[types.Part.from_text(text=msg.content)]
                        )
                    )
                contents.append(
                    types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=augmented_prompt)]
                    )
                )

                response = gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.3,
                        top_p=0.9
                    )
                )
                assistant_reply = response.text
                print("=====================================")
                print(f"Model used for {request.user_name}: gemini-2.5-flash")
                print("=====================================")
            except Exception as e:
                print(f"Gemini API failed: {e}. Falling back to SambaNova...")
                
        # 4. Fallback to SambaNova API if Gemini fails or is not available
        if not assistant_reply and client:
            messages = [{"role": "system", "content": system_prompt}]
            for msg in request.history:
                messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": augmented_prompt})
            
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.3,
                top_p=0.9
            )
            assistant_reply = response.choices[0].message.content
            print("=====================================")
            print(f"Model used for {request.user_name}: DeepSeek-V3.1 (SambaNova Fallback)")
            print("=====================================")

        if not assistant_reply:
            raise HTTPException(status_code=500, detail="All AI models failed to respond.")
        
        # Extract source names for frontend citation
        sources = []
        if context_data:
            sources = list(set(re.findall(r'--- SOURCE: (.*?) ---', context_data)))

        return ChatResponse(reply=assistant_reply, sources=sources)
        
    except Exception as e:
        print(f"Error in OKF chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
