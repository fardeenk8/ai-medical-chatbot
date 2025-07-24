
Right now, I'm implementing a **PDF report generation feature** in the backend (FastAPI). The goal is to generate a **well-formatted medical report** for each diagnosis that includes:
- The diagnosis summary
- Audio input URL or transcript
- Embedded preview of the uploaded medical image (not just the filename or link)
- Additional fields like timestamp, diagnosis type, and symptom

I’m using the Python `fpdf` library to create the PDF on the server.

Please help me:
1. Format the PDF layout to look professional and structured.
2. Embed the image from a remote URL into the PDF (download temporarily and insert).
3. Ensure the PDF supports long diagnosis texts with proper wrapping and spacing.

Return complete, clean, modular code for the PDF generator function based on these requirements.
