from fastapi import APIRouter

router = APIRouter()

@router.get("/forecast")
async def get_forecast(lat: float = 20.0, lon: float = 73.78):
    # Mock Open-Meteo response
    return {
        "location": "Nashik",
        "current": {
            "temperature": 34,
            "condition": "Storm alert",
            "soil_moisture": 18
        },
        "forecast": [
            {"day": "Today", "high": 34, "low": 24, "condition": "Storm alert"},
            {"day": "Tue", "high": 30, "low": 22, "condition": "High rain"},
            {"day": "Wed", "high": 29, "low": 21, "condition": "Moderate"},
            {"day": "Thu", "high": 33, "low": 23, "condition": "Clear"},
            {"day": "Fri", "high": 35, "low": 25, "condition": "Harvest window"}
        ],
        "alerts": [
            "Cyclone advisory: Heavy rainfall expected in Nashik district 14-16 July. Harvest your soybean crop early."
        ]
    }
