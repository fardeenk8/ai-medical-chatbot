from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from app.services.pdf_service import generate_enhanced_pdf_report

router = APIRouter()

@router.post("/api/pdf-report")
async def generate_pdf_report_route(request: Request):
    data = await request.json()
    
    # Add more details to the data payload as needed
    # For example, you can pass the user ID, diagnosis ID, etc.
    # and fetch more details from the database here.
    
    filepath, filename = generate_enhanced_pdf_report(data)
    
    return FileResponse(filepath, media_type="application/pdf", filename=filename)

