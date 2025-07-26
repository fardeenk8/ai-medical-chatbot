# 🩺 MediCare AI – Your Personal Medical AI Assistant

MediCare AI is an AI-powered chatbot that provides medical insights by analyzing voice-based symptom descriptions and uploaded medical images. It leverages modern AI models to produce intelligent diagnostic reports and a seamless, voice-enabled interface for user-friendly healthcare assistance.

---

## ✨ Features

- 🎙️ **Voice Diagnosis**  
  Describe your symptoms using your voice and receive AI-generated medical feedback.

- 🖼️ **Medical Image Input (Static Visual Aid)**  
  Upload medical images to include in your diagnosis context. *(Note: No X-ray image processing yet)*

- 📝 **PDF Report Generation**  
  Automatically generate downloadable, professional medical diagnosis reports.

- 🕒 **Recent Diagnoses**  
  View history of past diagnoses, audio recordings, images, and AI responses.

---

## 🛠 Tech Stack

### 🚀 Frontend
- React.js + Vite
- TailwindCSS + ShadCN UI
- Audio Recorder & File Upload
- Axios for API interaction

### 🧠 Backend
- FastAPI (Python)
- OpenAI GPT model for diagnosis generation
- Whisper ASR (for voice transcription)
- FPDF (for PDF report creation)
- Uvicorn (ASGI server)

### 🗄️ Database
- MongoDB (via Mongoose)

### 🔌 APIs & Libraries Used
- OpenAI Chat API (GPT-4)
- Whisper (Speech-to-text)
- Google Text-to-Speech
- FPDF for PDF generation
- PIL (for future image rendering support)

---

## 📂 Project Structure

MediCare-AI/
├── ai-doc-diagnose-now/  # Frontend (React + Tailwind)
├── ai-doctor-backend/  # Backend (FastAPI + PDF Generation)
└── README.md

---

## 📈 Future Enhancements

- 🗣️ Support for multilingual voice input (e.g., Hindi, Marathi)
- 📱 Android/iOS native mobile app
- 🩻 AI-powered X-ray image interpretation
- 📊 Advanced PDF visuals with charts and health analytics
- 👨‍⚕️ Integration with certified doctors for second opinions

---

## 🧠 References & Literature

- Rajpurkar, P., et al. (2017). *CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning*. Stanford ML Group.
- Esteva, A., et al. (2019). *A guide to deep learning in healthcare*. Nature Medicine.
- Vaswani, A., et al. (2017). *Attention is All You Need*. NeurIPS.
- OpenAI Documentation: https://platform.openai.com/docs
- WHO AI for Health: https://www.who.int/health-topics/artificial-intelligence

---

## 🧑‍💻 Developed By

**Fardeen Kachawa**  
AI/ML Engineer | Full-Stack Developer  
[GitHub](https://github.com/fardeenk8) · [LinkedIn](https://www.linkedin.com/in/fardeenkachawa)

---

## 📥 Setup Instructions

### 💻 Frontend
cd ai-doc-diagnose-now
npm install
npm run dev

### 🔧 Backend
```bash
cd ai-doctor-backend
pipenv shell
uvicorn app.main:app --reload  or pipenv run uvicorn app.main:app --reload
```
---

📃 License

---

Let me know if you’d like the **multilingual ReadMe**, a `docs/` folder setup, or a `CONTRIBUTING.md` for open source collaboration!
