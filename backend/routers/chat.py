from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest
import time

router = APIRouter()

@router.post("/")
async def chat_endpoint(req: ChatRequest):
    # Mocking a streaming response for the UI testing
    async def generate():
        response_text = "Hello! I am your AgroSetu farming assistant. I can help you with crop disease management, pesticide recommendations, and understanding weather alerts. How can I help you today?"
        for word in response_text.split():
            yield f"{word} "
            time.sleep(0.05)
            
    return StreamingResponse(generate(), media_type="text/event-stream")
