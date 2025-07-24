from fastapi import APIRouter, Depends, HTTPException
from app.db import db, get_diagnosis_by_id 
from app.utils.auth import JWTBearer
from app.models.diagnosis import Diagnosis
from config import db
from fastapi.responses import FileResponse
from app.services.pdf_generator import generate_pdf_report

router = APIRouter()
auth = JWTBearer()

@router.post("/api/diagnosis", dependencies=[Depends(auth)])
def save_diagnosis(data: Diagnosis):
    db.diagnoses.insert_one(data.dict())
    return {"message": "Diagnosis saved"}

@router.get("/api/diagnosis", dependencies=[Depends(auth)])
def get_diagnoses(user_id: str = Depends(auth)):
    records = list(db.diagnoses.find({"userId": user_id}))
    for r in records:
        r["_id"] = str(r["_id"])
    return records

@router.get("/api/diagnosis/pdf/{diagnosis_id}")
async def get_diagnosis_pdf(diagnosis_id: str):
    # 1. Fetch the diagnosis data from DB
    diagnosis = get_diagnosis_by_id(diagnosis_id)
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")

    # 2. Generate the PDF and get the file path
    pdf_path = generate_pdf_report(diagnosis)

    # 3. Return the PDF as a download
    return FileResponse(
        path=pdf_path,
        filename=f"diagnosis-report-{diagnosis_id}.pdf",
        media_type="application/pdf"
    )
