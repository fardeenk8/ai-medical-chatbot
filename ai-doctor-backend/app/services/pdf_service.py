import os
import uuid
import requests
from fpdf import FPDF
from datetime import datetime

class PDFReportGenerator(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "MediCare AI - Medical Diagnosis Report", 0, 1, "C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", 0, 0, "C")

def generate_enhanced_pdf_report(data):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)

    pdf = PDFReportGenerator()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Title
    pdf.set_font("Arial", "B", 18)
    pdf.cell(0, 12, "Diagnosis Details", ln=True, align="L")
    pdf.ln(5)

    # Metadata
    pdf.set_font("Arial", "", 11)
    pdf.cell(0, 8, f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.cell(0, 8, f"Diagnosis Type: {data.get('type', 'N/A')}", ln=True)
    pdf.cell(0, 8, f"Symptom: {data.get('symptom', 'N/A')}", ln=True)
    pdf.ln(10)

    # Patient's Problem (Transcript)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Patient's Problem", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 10, data.get("transcript", "No transcript provided."))
    pdf.ln(10)

    # Diagnosis Summary
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Diagnosis Summary", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 10, data.get("diagnosis", "No diagnosis provided."))
    pdf.ln(10)

    # Media Files
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Associated Media", ln=True)
    pdf.set_font("Arial", "", 11)

    if data.get("image_url"):
        pdf.cell(0, 8, f"Image URL: {data.get('image_url')}", ln=True)
        try:
            # Construct the full URL for the image
            image_response = requests.get(data["image_url"], stream=True)   
            if image_response.status_code == 200:
                image_path = os.path.join(temp_dir, f"temp_image_{uuid.uuid4().hex}.jpg")
                with open(image_path, "wb") as f:
                    f.write(image_response.content)
                pdf.image(image_path, x=15, w=pdf.w - 30)
                os.remove(image_path)
        except Exception as e:
            pdf.cell(0, 8, f"Could not embed image: {e}", ln=True)

    # Save the PDF
    filename = f"diagnosis_report_{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(temp_dir, filename)
    pdf.output(filepath, "F")

    return filepath, filename
