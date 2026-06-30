from fastapi import APIRouter
from models.schemas import SchemesResponse, Scheme

router = APIRouter()

@router.get("/", response_model=SchemesResponse)
async def get_schemes():
    return SchemesResponse(
        schemes=[
            Scheme(
                id="pm-kisan",
                title="PM-KISAN Samman Nidhi",
                benefit_amount="₹6,000/yr",
                description="6th installment due - auto-linked to Aadhar"
            ),
            Scheme(
                id="pmfby",
                title="Pradhan Mantri Fasal Bima Yojana",
                benefit_amount="Subsidized premium",
                description="Crop insurance for post-harvest losses"
            )
        ]
    )
