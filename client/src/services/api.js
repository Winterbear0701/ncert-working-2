/**
 * API Service Layer
 *
 * This file contains all API calls to the backend.
 * Replace the placeholder functions with actual API implementations.
 *
 * BACKEND INTEGRATION GUIDE:
 * ==========================
 *
 * 1. Set up your backend API base URL:
 *    - Development: http://localhost:3000/api
 *    - Production: https://your-domain.com/api
 *
 * 2. Configure axios or fetch with:
 *    - Base URL
 *    - Authentication headers (JWT tokens)
 *    - Error handling interceptors
 *    - Request/response transformers
 *
 * 3. Environment variables (.env):
 *    VITE_API_BASE_URL=http://localhost:3000/api
 *    VITE_AI_API_KEY=your-ai-api-key (if using OpenAI, Anthropic, etc.)
 *
 * 4. Backend API Endpoints to implement:
 *    - POST   /api/annotations          - Create annotation
 *    - GET    /api/annotations          - Get all annotations (with filters)
 *    - GET    /api/annotations/:id      - Get single annotation
 *    - PATCH  /api/annotations/:id      - Update annotation
 *    - DELETE /api/annotations/:id      - Delete annotation
 *    - POST   /api/ai/process           - Process AI request
 *    - GET    /api/lessons              - Get lessons list
 *    - GET    /api/lessons/:id          - Get lesson details
 */

// TODO: Replace with actual API base URL from environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// TODO: Implement proper API client (axios or fetch wrapper)
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // TODO: Add authentication headers
  getHeaders() {
    return {
      "Content-Type": "application/json",
      // TODO: Add authorization header
      // 'Authorization': `Bearer ${getAuthToken()}`,
    };
  }

  // TODO: Implement generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    // TODO: Implement actual fetch/axios call
    console.warn(`API call to ${url} - Backend not implemented yet`);

    // Placeholder: Remove this when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: null, success: true }), 100);
    });
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Annotation Service
export const annotationService = {
  /**
   * TODO: Implement - Fetch all annotations
   * @param {Object} filters - { lessonId, pageNumber, type }
   * @returns {Promise<Array>} annotations
   */
  async fetchAll(filters = {}) {
    // TODO: Implement GET /api/annotations with query params
    const queryParams = new URLSearchParams(filters).toString();
    return apiClient.get(`/annotations?${queryParams}`);
  },

  /**
   * TODO: Implement - Create new annotation
   * @param {Object} annotation - Annotation data
   * @returns {Promise<Object>} created annotation
   */
  async create(annotation) {
    // TODO: Implement POST /api/annotations
    return apiClient.post("/annotations", annotation);
  },

  /**
   * TODO: Implement - Update annotation
   * @param {string|number} id - Annotation ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} updated annotation
   */
  async update(id, updates) {
    // TODO: Implement PATCH /api/annotations/:id
    return apiClient.patch(`/annotations/${id}`, updates);
  },

  /**
   * TODO: Implement - Delete annotation
   * @param {string|number} id - Annotation ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    // TODO: Implement DELETE /api/annotations/:id
    return apiClient.delete(`/annotations/${id}`);
  },
};

// AI Service
export const aiService = {
  /**
   * TODO: Implement - Process AI request
   * @param {Object} params - { text, action, context }
   * @returns {Promise<Object>} AI response
   *
   * Integration options:
   * 1. Direct API: Call OpenAI/Anthropic from frontend (less secure)
   * 2. Backend proxy: Send to your backend, which calls AI API (recommended)
   * 3. Server-Sent Events: Stream AI responses for better UX
   */
  async process(params) {
    // TODO: Implement POST /api/ai/process
    // Or integrate OpenAI SDK directly if handling client-side

    // Example for OpenAI (if using client-side):
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4',
    //     messages: [{ role: 'user', content: params.text }],
    //   }),
    // });

    return apiClient.post("/ai/process", params);
  },
};

// Lesson Service
export const lessonService = {
  /**
   * TODO: Implement - Fetch all lessons
   * @returns {Promise<Array>} lessons
   */
  async fetchAll() {
    // TODO: Implement GET /api/lessons
    return apiClient.get("/lessons");
  },

  /**
   * TODO: Implement - Fetch lesson by ID
   * @param {string|number} id - Lesson ID
   * @returns {Promise<Object>} lesson details
   */
  async fetchById(id) {
    // TODO: Implement GET /api/lessons/:id
    return apiClient.get(`/lessons/${id}`);
  },
};

// TODO: Add more services as needed (auth, user, etc.)
export const authService = {
  /**
   * TODO: Implement authentication
   */
  async login(credentials) {
    // TODO: Implement POST /api/auth/login
    return apiClient.post("/auth/login", credentials);
  },

  async logout() {
    // TODO: Implement POST /api/auth/logout
    return apiClient.post("/auth/logout");
  },

  async getCurrentUser() {
    // TODO: Implement GET /api/auth/me
    return apiClient.get("/auth/me");
  },
};

// Assessment Service
export const assessmentService = {
  /**
   * TODO: Implement - Submit voice assessment
   * @param {Object} assessment - { lessonId, answers: [{question, answer, timestamp}] }
   * @returns {Promise<Object>} assessment result with score
   *
   * Backend should:
   * 1. Receive voice transcripts or audio files
   * 2. Use AI (GPT/Claude) to evaluate answers
   * 3. Generate score based on:
   *    - Correctness
   *    - Completeness
   *    - Relevance to lesson content
   * 4. Store result in database
   */
  async submit(assessment) {
    // TODO: Implement POST /api/assessments
    return apiClient.post("/assessments", assessment);
  },

  /**
   * TODO: Implement - Evaluate assessment with AI
   * @param {Object} params - { lessonId, answers }
   * @returns {Promise<Object>} { score, feedback, strengths, improvements }
   *
   * AI Evaluation Prompt Example:
   * "You are evaluating student answers for a lesson on [topic].
   * Question: [question]
   * Student Answer: [answer]
   * Evaluate based on: accuracy, completeness, understanding.
   * Return score (0-100) and brief feedback."
   */
  async evaluate(params) {
    // TODO: Implement POST /api/assessments/evaluate
    return apiClient.post("/assessments/evaluate", params);
  },

  /**
   * TODO: Implement - Get test questions for page range
   * @param {Object} params - { lessonId, startPage, endPage }
   * @returns {Promise<Array>} questions
   */
  async getQuestions(params) {
    // TODO: Implement GET /api/assessments/questions
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/assessments/questions?${queryParams}`);
  },

  /**
   * TODO: Implement - Get assessment history
   * @param {string|number} lessonId - Lesson ID
   * @returns {Promise<Array>} past assessments with scores
   */
  async getHistory(lessonId) {
    // TODO: Implement GET /api/assessments/history/:lessonId
    return apiClient.get(`/assessments/history/${lessonId}`);
  },

  /**
   * TODO: Implement - Save assessment score
   * @param {Object} scoreData - { lessonId, score, completedAt }
   * @returns {Promise<Object>} saved score record
   */
  async saveScore(scoreData) {
    // TODO: Implement POST /api/assessments/scores
    return apiClient.post("/assessments/scores", scoreData);
  },
};
