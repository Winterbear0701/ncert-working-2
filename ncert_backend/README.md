# 🎓 NCERT AI Learning Backend

<p align="center">
  <strong>Production-grade FastAPI backend for AI-powered NCERT learning system</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.109-green.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/Gemini-1.5%20Flash-orange.svg" alt="Gemini">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/Pinecone-Vector%20DB-blue.svg" alt="Pinecone">
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This backend powers an AI-driven educational platform for NCERT students (Classes 5-10). It provides:

- **RAG-based intelligent chatbot** for personalized explanations
- **AI-generated MCQs** from chapter content
- **Automated evaluation** with detailed feedback
- **Student notes management**

All responses are strictly context-based using **Retrieval-Augmented Generation (RAG)** - no hallucination!

---

## ✨ Features

### 🤖 RAG-Based Chat
- Multi-mode explanations: Simple, Meaning, Story, Example, Summary
- Context retrieved from Pinecone vector database
- Responses formatted by Gemini 1.5 Flash

### 📝 MCQ Generation
- Concept-based questions (not copy-paste)
- Generated from chapter embeddings
- Includes explanations for each answer

### ✅ Automated Evaluation
- Instant scoring and percentage calculation
- Personalized feedback based on performance
- Results saved to MongoDB Atlas

### 📚 Notes Management
- Create, read, update, delete student notes
- Filter by class, subject, chapter
- Linked to specific pages and highlights

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | FastAPI 0.109 |
| **Language** | Python 3.10+ |
| **AI Model** | Google Gemini 1.5 Flash |
| **Embeddings** | Gemini text-embedding-004 |
| **Vector Database** | Pinecone |
| **Primary Database** | MongoDB Atlas |
| **Server** | Uvicorn |

---

## 📁 Project Structure

```
ncert_backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py            # Settings & environment variables
│   ├── db/
│   │   ├── __init__.py
│   │   └── mongo.py             # MongoDB & Pinecone connections
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py           # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── chat.py              # RAG chat endpoints
│   │   ├── mcq.py               # MCQ generation
│   │   ├── evaluate.py          # Evaluation endpoints
│   │   └── notes.py             # Notes CRUD
│   └── services/
│       ├── __init__.py
│       ├── gemini_service.py    # Gemini AI integration
│       ├── rag_service.py       # RAG logic
│       ├── mcq_service.py       # MCQ generation logic
│       ├── eval_service.py      # Evaluation logic
│       └── notes_service.py     # Notes management
├── .env                         # Environment variables (create this)
├── .env.example                 # Example environment file
├── .gitignore
├── requirements.txt             # Python dependencies
├── run.py                       # Server startup script
└── README.md                    # This file
```

---

## 📦 Prerequisites

### Required Accounts & Keys

1. **Google Cloud (Gemini API)**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an API key for Gemini

2. **Pinecone**
   - Sign up at [Pinecone](https://www.pinecone.io/)
   - Create a new index named `ncert-learning-rag`
   - **Dimension**: 768 (for text-embedding-004)
   - **Metric**: cosine
   - Note your API key and index host

3. **MongoDB Atlas**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Create a database user
   - Whitelist your IP (or use 0.0.0.0/0 for testing)
   - Get your connection string

### Software Requirements

- **Python 3.10 or higher**
- **pip** (Python package manager)
- **Git** (optional, for cloning)

---

## 🚀 Installation

### Step 1: Clone or Navigate to Project

```bash
cd d:\Projects\ncert-working-2\ncert_backend
```

### Step 2: Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuration

### Step 1: Create `.env` File

Copy the example file:

```bash
cp .env.example .env
```

### Step 2: Fill in Environment Variables

Edit `.env` with your actual credentials:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/ncert_learning?retryWrites=true&w=majority

# Google Gemini API
GEMINI_API_KEY=AIzaSy...your_actual_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=ncert-learning-rag
PINECONE_HOST=https://ncert-learning-rag-xxxxx.svc.pinecone.io

# Application Settings
APP_NAME="NCERT AI Learning Backend"
APP_VERSION="1.0.0"
DEBUG=True

# CORS Settings (Frontend URL)
FRONTEND_URL=http://localhost:5173

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

**Important Notes:**
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` in MongoDB URI
- Get your Pinecone host from dashboard (copy full URL)
- Keep `DEBUG=True` for development, `False` for production

---

## 🏃 Running the Server

### Method 1: Using `run.py` (Recommended)

```bash
python run.py
```

### Method 2: Using `uvicorn` directly

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Expected Output

```
============================================================
🚀 Starting NCERT AI Learning Backend
   Version: 1.0.0
   Host: 0.0.0.0:8000
   Debug: True
   Docs: http://0.0.0.0:8000/docs
============================================================
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
✅ Connected to MongoDB Atlas successfully
✅ Connected to Pinecone successfully
   Index: ncert-learning-rag
   Total vectors: 0
✅ All databases initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

### 🗨️ Chat / RAG

#### `POST /api/chat/`

RAG-based chat with multi-mode explanations.

**Request Body:**
```json
{
  "class_level": 6,
  "subject": "Geography",
  "chapter": 1,
  "highlight_text": "What is latitude?",
  "mode": "simple"
}
```

**Modes:** `simple`, `meaning`, `story`, `example`, `summary`

**Response:**
```json
{
  "answer": "Latitude is the distance...",
  "used_mode": "simple",
  "source_chunks": ["...", "..."]
}
```

---

### 📝 MCQ Generation

#### `POST /api/mcq/generate`

Generate AI-powered MCQs from chapter content.

**Request Body:**
```json
{
  "class_level": 6,
  "subject": "Geography",
  "chapter": 1,
  "num_questions": 5
}
```

**Response:**
```json
{
  "mcqs": [
    {
      "question": "What are lines of latitude?",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "..."
    }
  ],
  "metadata": {
    "class_level": 6,
    "subject": "Geography",
    "chapter": 1,
    "num_questions": 5
  }
}
```

---

### ✅ Evaluation

#### `POST /api/evaluate/`

Evaluate student's MCQ answers.

**Request Body:**
```json
{
  "student_id": "student123",
  "class_level": 6,
  "subject": "Geography",
  "chapter": 1,
  "mcqs": [...],
  "answers": [
    {"question_index": 0, "selected_index": 0},
    {"question_index": 1, "selected_index": 2}
  ]
}
```

**Response:**
```json
{
  "result": {
    "total_questions": 5,
    "correct_answers": 4,
    "percentage": 80.0,
    "feedback": "Good job! You scored 4/5...",
    "question_results": [...]
  },
  "saved_to_db": true,
  "evaluation_id": "507f1f77bcf86cd799439011"
}
```

---

### 📚 Notes

#### `POST /api/notes/`

Create a new note.

**Request Body:**
```json
{
  "student_id": "student123",
  "class_level": 6,
  "subject": "Geography",
  "chapter": 1,
  "page_number": 5,
  "highlight_text": "Latitude definition",
  "note_content": "Important for test",
  "heading": "Latitude"
}
```

#### `GET /api/notes/{student_id}`

Get all notes for a student (with optional filters).

**Query Parameters:**
- `class_level` (optional)
- `subject` (optional)
- `chapter` (optional)

#### `PATCH /api/notes/{note_id}`

Update a note.

#### `DELETE /api/notes/{note_id}`

Delete a note.

---

## 🏗️ Architecture

### RAG Flow

```
Student Highlights Text
        ↓
1. Generate Embedding (Gemini)
        ↓
2. Query Pinecone with Metadata Filter
   (class, subject, chapter)
        ↓
3. Retrieve Top-K Chunks
        ↓
4. Format with Gemini (mode-based prompt)
        ↓
5. Return Answer + Source Chunks
```

### Strict Rules

- **NO HALLUCINATION**: Only use RAG context
- **METADATA FILTERING**: Exact class/subject/chapter matching
- **MODE-SPECIFIC PROMPTS**: Different explanations for different learning styles
- **SOURCE TRACKING**: Always return which chunks were used

---

## 🗄️ Database Setup

### MongoDB Collections

The following collections will be automatically created:

1. **`notes`** - Student notes
2. **`evaluations`** - MCQ evaluation results
3. **`assessments`** - Voice assessment results (future)
4. **`quiz_results`** - Quiz scores (future)

### Pinecone Index Setup

**IMPORTANT**: You need to populate your Pinecone index with chapter embeddings.

#### Index Configuration

```
Name: ncert-learning-rag
Dimension: 768
Metric: cosine
Cloud: AWS (or GCP)
Region: us-east-1 (or nearest)
```

#### Sample Data Upload Script

Create `scripts/upload_data.py`:

```python
from pinecone import Pinecone
import google.generativeai as genai
from app.core.config import settings

# Initialize
genai.configure(api_key=settings.GEMINI_API_KEY)
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX, host=settings.PINECONE_HOST)

# Sample data
chapters = [
    {
        "id": "class6-geo-ch1-p1",
        "text": "Latitude is the angular distance...",
        "metadata": {
            "class": 6,
            "subject": "Geography",
            "chapter": 1,
            "page": 1
        }
    }
    # Add more chunks...
]

# Upload
vectors = []
for chapter in chapters:
    embedding = genai.embed_content(
        model='models/text-embedding-004',
        content=chapter['text'],
        task_type="retrieval_document"
    )['embedding']
    
    vectors.append((
        chapter['id'],
        embedding,
        chapter['metadata']
    ))

index.upsert(vectors=vectors)
print(f"✅ Uploaded {len(vectors)} vectors")
```

---

## 🚢 Deployment

### Option 1: Railway / Render

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables in dashboard
4. Deploy automatically

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY run.py .

EXPOSE 8000

CMD ["python", "run.py"]
```

Build and run:

```bash
docker build -t ncert-backend .
docker run -p 8000:8000 --env-file .env ncert-backend
```

### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

1. SSH into server
2. Install Python 3.10+
3. Clone repository
4. Set up virtual environment
5. Install dependencies
6. Configure systemd service
7. Use Nginx as reverse proxy

---

## 🐛 Troubleshooting

### Import Errors (Development)

The linter warnings about imports are normal when dependencies aren't installed. Install them:

```bash
pip install -r requirements.txt
```

### MongoDB Connection Fails

- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure username/password are URL-encoded

### Pinecone Connection Fails

- Verify API key is correct
- Check if index name matches exactly
- Ensure host URL is complete (starts with `https://`)

### Gemini API Errors

- Verify API key is active
- Check quota limits in Google AI Studio
- Ensure embedding model is `text-embedding-004`

### CORS Errors

- Add your frontend URL to `FRONTEND_URL` in `.env`
- Check `main.py` CORS middleware settings

---

## 📞 Support

For issues or questions:

1. Check [FastAPI Documentation](https://fastapi.tiangolo.com/)
2. Check [Gemini API Docs](https://ai.google.dev/docs)
3. Check [Pinecone Docs](https://docs.pinecone.io/)

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- **FastAPI** for the amazing framework
- **Google** for Gemini AI
- **Pinecone** for vector database
- **MongoDB** for Atlas platform

---

<p align="center">
  <strong>Built with ❤️ for NCERT Students</strong>
</p>
