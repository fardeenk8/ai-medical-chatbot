from fpdf import FPDF
import os
import uuid

def generate_pdf_report(diagnosis):
    print(f"DEBUG: Diagnosis data received by PDF generator: {diagnosis}")
    filename = f"report-{uuid.uuid4().hex}.pdf"
    filepath = os.path.join("temp", filename)
    
    os.makedirs("temp", exist_ok=True)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Medical Diagnosis Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Type: {diagnosis.get('type', 'N/A')}", ln=True)
    pdf.cell(0, 10, f"Symptom: {diagnosis.get('symptom', 'N/A')}", ln=True)
    pdf.multi_cell(0, 10, f"Diagnosis:\n{diagnosis.get('diagnosis', 'N/A')}")
    pdf.ln(5)

    if diagnosis.get('audioUrl'):
        pdf.cell(0, 10, f"Audio URL: {diagnosis['audioUrl']}", ln=True)
    if diagnosis.get('imageUrl'):
        pdf.cell(0, 10, f"Image URL: {diagnosis['imageUrl']}", ln=True)

    # Final step - write file in binary-safe way
    pdf.output(filepath, "F")

    print(f"[PDF] Report saved at: {filepath}")
    return filepath
