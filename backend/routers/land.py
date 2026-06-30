from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_land_status():
    return {
        "health": 82,
        "max": 100,
        "crop": "Soybean",
        "field": "Field A"
    }
