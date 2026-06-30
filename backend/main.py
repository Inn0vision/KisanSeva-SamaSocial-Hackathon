from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, disease, weather, schemes, land, water, okf_chat

app = FastAPI(title="KisanSeva API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(disease.router, prefix="/api/disease", tags=["Disease"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Schemes"])
app.include_router(land.router, prefix="/api/land", tags=["Land"])
app.include_router(water.router, prefix="/api/water", tags=["Water"])
app.include_router(okf_chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to KisanSeva API"}
