/**
 * API Service - Backend Integration
 * 
 * This file contains all API calls to the FastAPI backend
 * Base URL: http://localhost:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Chat Service - AI Explanations with RAG
 * Integrates with the backend RAG system for annotations and assessment
 */
export const chatService = {
  /**
   * Get AI explanation for selected text
   * @param {string} text - The selected text to explain
   * @param {string} mode - Explanation mode (simple/meaning/example/story/summary)
   * @param {number} classLevel - User's class level (5-10)
   * @param {string} subject - Subject name
   * @param {number} chapter - Chapter number
   * @returns {Promise<{answer: string, sources: array}>}
   */
  async getExplanation(text, mode, classLevel, subject, chapter) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          highlight_text: text,  // ✅ Changed from 'query' to 'highlight_text'
          mode: mode,
          class_level: classLevel,
          subject: subject,
          chapter: chapter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return {
        answer: data.answer,
        sources: data.source_chunks || [],  // ✅ Changed from 'sources' to 'source_chunks'
      };
    } catch (error) {
      console.error("Chat API Error:", error);
      throw error;
    }
  },
};

/**
 * Assessment Service - Voice Assessment Integration
 * For future assessment features
 */
export const assessmentService = {
  /**
   * Get assessment questions from textbook content (RAG-based)
   * @param {number} classLevel - User's class level (5-10)
   * @param {string} subject - Subject name
   * @param {number} chapter - Chapter number
   * @param {number} numQuestions - Number of questions to generate (default: 3)
   * @returns {Promise<{questions: array}>}
   */
  async getQuestions(classLevel, subject, chapter, numQuestions = 3) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/assessment/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_level: classLevel,
          subject: subject,
          chapter: chapter,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Assessment API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Assessment Questions API Error:", error);
      throw error;
    }
  },

  /**
   * Evaluate voice assessment answers
   * @param {number} classLevel - User's class level
   * @param {string} subject - Subject name
   * @param {number} chapter - Chapter number
   * @param {array} answers - Array of {question, answer} objects
   * @returns {Promise<{score: number, feedback: string}>}
   */
  async evaluateAnswers(classLevel, subject, chapter, answers) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/assessment/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_level: classLevel,
          subject: subject,
          chapter: chapter,
          answers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Assessment Evaluation API Error:", error);
      throw error;
    }
  },

  /**
   * Submit voice assessment (legacy - for audio file upload)
   * @param {Blob} audioBlob - Recorded audio
   * @param {object} metadata - Assessment metadata (chapter, question, etc.)
   * @returns {Promise<object>}
   */
  async submitAssessment(audioBlob, metadata) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "assessment.webm");
      formData.append("metadata", JSON.stringify(metadata));

      const response = await fetch(`${API_BASE_URL}/api/assessment`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Assessment API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Assessment API Error:", error);
      throw error;
    }
  },
};

/**
 * Utility: Check backend health
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};

export default {
  chatService,
  assessmentService,
  healthCheck,
};
