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

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import Request

# Mount static files and handle SPA routing
frontend_dist = os.path.join(os.path.dirname(__file__), "static")

if os.path.exists(frontend_dist):
    # Mount specific asset directories to prevent shadowing API routes
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Serve files directly from the root if they exist (like favicon.ico, etc.)
    # and fallback to index.html for React Router
    @app.api_route("/{path_name:path}", methods=["GET"])
    async def catch_all(request: Request, path_name: str):
        # Ignore API routes - they should have been caught by the routers above
        if path_name.startswith("api/"):
            return {"detail": "Not Found"}
            
        file_path = os.path.join(frontend_dist, path_name)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback for React Router SPA
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": "Welcome to KisanSeva API (Static files not found, frontend not built)"}
