<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JATAYU - AI Study Assistant

JATAYU is an intelligent study assistant inspired by JARVIS from Iron Man, designed to help students learn more effectively using AI-powered tools. Built with modern web technologies and Google's Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1qaPJsWFgneVeoudRSuOT-yRtzq4FVptQ

## ✨ Features

- **PDF Processing**: Upload and process PDF documents for AI analysis
- **AI-Powered Summaries**: Generate intelligent summaries with caching
- **Interactive Quizzes**: Create customized quizzes with multiple choice, true/false, and open-ended questions
- **Flashcards**: Generate study flashcards from text content
- **Study Plans**: Create detailed multi-day study plans
- **Question Generation**: Generate practice questions at different difficulty levels
- **Responsive UI**: Modern React-based interface with TypeScript

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **FastAPI** (Python) for REST API
- **Google Gemini AI** for content generation
- **SQLAlchemy** with SQLite for data persistence
- **PDFPlumber** for PDF text extraction
- **Uvicorn** as ASGI server

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd assistente-de-estudos-ia
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend:**
   ```bash
   cd ..  # Back to root
   npm install
   ```

4. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Add to `.env.local`:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

### Running the Application

1. **Start the backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   Backend will be available at: http://127.0.0.1:8000

2. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend will be available at: http://localhost:3000

## 📁 Project Structure

```
assistente-de-estudos-ia/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── database/       # Database models and setup
│   │   ├── schemas/        # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   └── requirements.txt
├── components/              # React components
├── services/               # Frontend services
├── .env.local              # Environment variables
├── package.json
├── vite.config.ts
└── README.md
```

## 🔄 Recent Updates

### Latest Commits
- **refactor: Consolidate Gemini and API client logic** - Improved AI service integration
- **feat: Add new 'perguntas' feature and related UI/API changes** - Added question generation functionality
- **feat: Initialize Vite + React project for Study Assistant** - Set up modern frontend stack
- **Initial commit** - Project foundation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by JARVIS from the Iron Man franchise
- Powered by Google's Gemini AI
- Built with FastAPI and React
