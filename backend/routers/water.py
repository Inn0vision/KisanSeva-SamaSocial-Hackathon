from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_water_status():
    return {
        "moisture": 18,
        "status": "Irrigation needed"
    }
