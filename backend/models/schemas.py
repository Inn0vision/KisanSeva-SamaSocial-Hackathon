from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str

class DiseaseScanResponse(BaseModel):
    disease_name: str
    confidence: float
    severity: str
    recommendation: str

class Scheme(BaseModel):
    id: str
    title: str
    benefit_amount: str
    description: str

class SchemesResponse(BaseModel):
    schemes: List[Scheme]
