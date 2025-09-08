# Development Setup

## Quick Start

### Option 1: Automatic (Windows)
Run the batch script:
```bash
start-dev.bat
```

### Option 2: Manual
1. **Start Backend** (Terminal 1):
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:5000

2. **Start Frontend** (Terminal 2):
```bash
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## Configuration

- **Frontend Port**: 5173 (configured in vite.config.js)
- **Backend Port**: 5000 (configured in backend/.env)
- **CORS**: Backend allows requests from http://localhost:5173

## API Endpoints

Backend provides these endpoints:
- `GET /health` - Health check
- `POST /api/images/*` - Image processing
- `POST /api/chat/*` - AI chat functionality

## Environment Variables

Make sure you have a valid Gemini API key in:
- `backend/.env` - GEMINI_API_KEY
- Frontend will use VITE_GEMINI_API_KEY from .env.local (if needed)