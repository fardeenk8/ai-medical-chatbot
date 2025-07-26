from fpdf import FPDF
import os
import uuid
from datetime import datetime

def generate_pdf_report(diagnosis):
    # print(f"DEBUG: Diagnosis data received by PDF generator: {diagnosis}")
    filename = f"diagnosis_report_{uuid.uuid4().hex}.pdf"
    filepath = os.path.join("temp", filename)
    
    os.makedirs("temp", exist_ok=True)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Add logo
    logo_path = os.path.join("sample-assets", "MediCare-AI-logo1.png")
    if os.path.exists(logo_path):
        logo_width = 40 # Adjust as needed
        x_pos = (pdf.w - logo_width) / 2
        pdf.image(logo_path, x=x_pos, y=10, w=logo_width)
    pdf.ln(30) # Move cursor down after logo

    # Header
    pdf.set_font("Arial", "B", 24)
    pdf.set_text_color(30, 144, 255) # Dodger Blue
    pdf.cell(0, 15, "MediCare AI - Doctor Medical Report", ln=True, align="C")
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 5, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
    pdf.ln(10)

    # Patient Information Section
    pdf.set_fill_color(230, 230, 250) # Lavender
    pdf.rect(10, pdf.get_y(), pdf.w - 20, 10, 'F')
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, "Patient Information", ln=True, align="L")
    pdf.ln(2)

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 8, f"Patient ID: {diagnosis.get('userId', 'Anonymous')}", ln=True)
    pdf.cell(0, 8, f"Report ID: {diagnosis.get('frontendId', 'N/A')}", ln=True)
    pdf.ln(5)

    # Symptoms/Transcript Section
    pdf.set_fill_color(230, 230, 250) # Lavender
    pdf.rect(10, pdf.get_y(), pdf.w - 20, 10, 'F')
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, "Patient's Input (Transcript)", ln=True, align="L")
    pdf.ln(2)

    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, f"Symptom: {diagnosis.get('symptom', 'N/A')}")
    pdf.multi_cell(0, 8, f"Transcript: {diagnosis.get('transcript', 'N/A')}")
    pdf.ln(5)

    # AI Diagnosis Section
    pdf.set_fill_color(230, 230, 250) # Lavender
    pdf.rect(10, pdf.get_y(), pdf.w - 20, 10, 'F')
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, "AI Diagnosis", ln=True, align="L")
    pdf.ln(2)

    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, diagnosis.get('diagnosis', 'N/A'))
    pdf.ln(5)

    # Media Attachments Section
    if diagnosis.get('audioUrl') or diagnosis.get('imageUrl'):
        pdf.set_fill_color(230, 230, 250) # Lavender
        pdf.rect(10, pdf.get_y(), pdf.w - 20, 10, 'F')
        pdf.set_font("Arial", "B", 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, "Media Attachments", ln=True, align="L")
        pdf.ln(2)

        pdf.set_font("Arial", "", 12)
        if diagnosis.get('audioUrl'):
            pdf.cell(0, 8, f"Audio Recording: {diagnosis['audioUrl']}", ln=True)
        if diagnosis.get('imageUrl'):
            pdf.cell(0, 8, f"Uploaded Image: {diagnosis['imageUrl']}", ln=True)
        pdf.ln(5)

    # Disclaimer
    pdf.set_font("Arial", "I", 10)
    pdf.set_text_color(150, 150, 150)
    pdf.multi_cell(0, 5, "Disclaimer: This AI-generated report is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for any health concerns.", align="C")

    # Final step - write file in binary-safe way
    pdf.output(filepath, "F")

    print(f"[PDF] Report saved at: {filepath}")
    return filepath
