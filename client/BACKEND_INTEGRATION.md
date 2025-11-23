# Backend Integration Checklist

## Overview
This document provides a step-by-step guide for integrating the backend API with the frontend application.

---

## 🎯 Integration Points Summary

### 1. Annotations Management
**Location:** `src/stores/annotationStore.js`

#### Actions to Integrate:
- [ ] `addNote()` → `POST /api/annotations`
- [ ] `addAIAnnotation()` → `POST /api/annotations/ai`  
- [ ] `updateAIResponse()` → `PATCH /api/annotations/:id`
- [ ] `deleteAnnotation()` → `DELETE /api/annotations/:id`
- [ ] `getAnnotationsByLesson()` → `GET /api/annotations?lessonId=:id`
- [ ] `getAnnotationsByPage()` → `GET /api/annotations?lessonId=:id&pageNumber=:num`

**Example Implementation:**
```javascript
// In annotationStore.js
import { annotationService } from '@/services/api';

addNote: async (data) => {
  try {
    // TODO: Replace this local logic with API call
    const savedAnnotation = await annotationService.create(data);
    set((state) => ({
      annotations: [...state.annotations, savedAnnotation],
      activePanel: null,
      selectedText: null,
    }));
    return savedAnnotation;
  } catch (error) {
    // TODO: Add proper error handling
    console.error('Failed to save note:', error);
    throw error;
  }
},
```

---

### 2. AI Service Integration
**Location:** `src/features/annotations/AIPanel.jsx`

#### What to Do:
- [ ] Replace `setTimeout` simulation with actual AI API call
- [ ] Use either OpenAI, Anthropic, or your custom AI backend

**Option A: Using Backend Proxy (Recommended)**
```javascript
// In AIPanel.jsx handleActionSelect()
import { aiService } from '@/services/api';

const handleActionSelect = async (action) => {
  setSelectedAction(action.id);
  setIsProcessing(true);
  
  try {
    // TODO: Replace setTimeout with this
    const aiResponse = await aiService.process({
      text: selectedText.text,
      action: action.id,
      context: {
        lessonId: currentLesson.id,
        pageNumber: pageNumber
      }
    });
    
    setResponse(aiResponse.data.response);
    setIsProcessing(false);
  } catch (error) {
    console.error('AI processing failed:', error);
    setIsProcessing(false);
    // TODO: Show error message to user
  }
};
```

**Option B: Direct OpenAI Integration**
```javascript
// In AIPanel.jsx
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const handleActionSelect = async (action) => {
  setSelectedAction(action.id);
  setIsProcessing(true);
  
  try {
    const prompt = buildPrompt(action.id, selectedText.text);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    
    setResponse(completion.choices[0].message.content);
    setIsProcessing(false);
  } catch (error) {
    console.error('AI processing failed:', error);
    setIsProcessing(false);
  }
};

function buildPrompt(action, text) {
  const prompts = {
    simplify: `Simplify the following text:\n\n${text}`,
    refine: `Refine and improve the following text:\n\n${text}`,
    examples: `Provide practical examples for:\n\n${text}`,
    explain: `Provide a detailed explanation of:\n\n${text}`,
  };
  return prompts[action];
}
```

---

### 3. Lessons Management
**Location:** `src/App.jsx`

#### What to Do:
- [ ] Replace `SAMPLE_LESSONS` constant with API call
- [ ] Fetch lessons on app mount

**Implementation:**
```javascript
// In App.jsx
import { useEffect } from 'react';
import { lessonService } from '@/services/api';

function App() {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement this
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await lessonService.fetchAll();
        setLessons(response.data);
        setCurrentLesson(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        // TODO: Show error message
      } finally {
        setLoading(false);
      }
    };
    
    fetchLessons();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  // ... rest of component
}
```

---

### 4. API Client Configuration
**Location:** `src/services/api.js`

#### Steps:
1. [ ] Set up environment variables
2. [ ] Configure API base URL
3. [ ] Add authentication headers
4. [ ] Implement error handling
5. [ ] Add request/response interceptors

**Environment Variables (.env):**
```env
# Backend API
VITE_API_BASE_URL=http://localhost:3000/api

# AI Service (if using direct integration)
VITE_OPENAI_API_KEY=sk-...
# OR
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**API Client Setup:**
```javascript
// In services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Add authentication interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TODO: Add error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 5. Authentication (Future)
**Location:** `src/services/api.js`

#### What to Implement:
- [ ] Login endpoint
- [ ] Logout endpoint
- [ ] Token storage
- [ ] Protected routes
- [ ] User context/store

**Example:**
```javascript
// In services/api.js
export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
  },
  
  async logout() {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },
  
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },
};
```

---

## 🔧 Backend API Endpoints Required

### Annotations
```
POST   /api/annotations           - Create annotation
GET    /api/annotations           - Get all annotations (filterable)
GET    /api/annotations/:id       - Get annotation by ID
PATCH  /api/annotations/:id       - Update annotation
DELETE /api/annotations/:id       - Delete annotation

Query Parameters for GET /api/annotations:
- lessonId: number
- pageNumber: number
- type: 'note' | 'ai'
- limit: number
- offset: number
```

### AI Processing
```
POST   /api/ai/process            - Process AI request

Request Body:
{
  "text": "selected text",
  "action": "simplify" | "refine" | "examples" | "explain",
  "context": {
    "lessonId": 1,
    "pageNumber": 5
  }
}

Response:
{
  "response": "AI generated response text",
  "model": "gpt-4",
  "tokensUsed": 150
}
```

### Lessons
```
GET    /api/lessons               - Get all lessons
GET    /api/lessons/:id           - Get lesson by ID

Response:
{
  "id": 1,
  "number": 1,
  "title": "Lesson Title",
  "description": "Description",
  "pdfUrl": "https://storage.../lesson1.pdf",
  "author": "John Doe",
  "duration": "45 mins",
  "difficulty": "beginner",
  "tags": ["geography", "maps"]
}
```

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login
POST   /api/auth/logout           - Logout
GET    /api/auth/me               - Get current user
POST   /api/auth/refresh          - Refresh token
```

---

## 📝 Database Schema Suggestions

### Annotations Table
```sql
CREATE TABLE annotations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  lesson_id INTEGER REFERENCES lessons(id),
  type VARCHAR(10) CHECK (type IN ('note', 'ai')),
  text TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  position JSONB,
  
  -- For notes
  heading VARCHAR(255),
  content TEXT,
  
  -- For AI annotations
  action VARCHAR(20),
  response TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_annotations_lesson ON annotations(lesson_id);
CREATE INDEX idx_annotations_user ON annotations(user_id);
```

### Lessons Table
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pdf_url VARCHAR(500) NOT NULL,
  author VARCHAR(100),
  duration VARCHAR(50),
  difficulty VARCHAR(20),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Testing Checklist

### Without Backend (Current State)
- [x] UI renders correctly
- [x] Text selection works
- [x] Annotation panels open/close
- [x] Annotations save to localStorage
- [x] History displays correctly
- [x] Highlights appear on PDF

### With Backend Integration
- [ ] Annotations persist to database
- [ ] Annotations sync across page reloads
- [ ] AI responses are real (not simulated)
- [ ] Lessons load from API
- [ ] Error handling works
- [ ] Loading states display
- [ ] Authentication works
- [ ] Multiple users can have separate annotations

---

## 🚀 Deployment Notes

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Backend Requirements
- Node.js / Python / Go (your choice)
- PostgreSQL / MySQL / MongoDB
- Redis (optional, for caching)
- OpenAI API key (if using AI features)

### Recommended Stack
- **Backend:** Node.js + Express / NestJS / FastAPI
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT tokens
- **Storage:** AWS S3 / Azure Blob (for PDFs)
- **AI:** OpenAI API / Anthropic Claude

---

## 📚 Additional Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React PDF Documentation](https://github.com/wojtekmaj/react-pdf)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## Need Help?

Check the inline `TODO` comments in:
- `src/stores/annotationStore.js`
- `src/services/api.js`
- `src/features/annotations/AIPanel.jsx`
- `src/App.jsx`

Each file has detailed comments on where and how to integrate backend functionality.
