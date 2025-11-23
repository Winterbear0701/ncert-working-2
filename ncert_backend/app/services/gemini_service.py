"""
Gemini Service - Handles all Google Gemini AI interactions.
"""

import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for interacting with Google Gemini AI."""
    
    def __init__(self):
        # Initialize Gemini 2.5 Flash model for chat/explanations
        self.chat_model = genai.GenerativeModel('models/gemini-2.5-flash')
        
        # Initialize embedding model
        self.embedding_model = 'models/text-embedding-004'
    
    def generate_embedding(self, text: str) -> list[float]:
        """
        Generate embedding vector for text using Gemini embedding model.
        
        Args:
            text: Input text to embed
        
        Returns:
            Embedding vector (list of floats)
        """
        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']
        
        except Exception as e:
            logger.error(f"❌ Embedding generation failed: {e}")
            raise
    
    def format_explanation(
        self, 
        context: str, 
        question: str, 
        mode: str
    ) -> str:
        """
        Generate explanation using Gemini based on RAG context and mode.
        
        Args:
            context: RAG-retrieved context chunks
            question: Student's highlighted text/question
            mode: Explanation mode (simple/meaning/story/example/summary)
        
        Returns:
            Formatted explanation string
        """
        try:
            # Build mode-specific prompt
            prompt = self._build_prompt(context, question, mode)
            
            # Generate response
            response = self.chat_model.generate_content(prompt)
            
            return response.text
        
        except Exception as e:
            logger.error(f"❌ Gemini explanation failed: {e}")
            raise
    
    def _build_prompt(self, context: str, question: str, mode: str) -> str:
        """Build strict prompt based on mode to prevent hallucination."""
        
        base_instruction = f"""You are an AI tutor for NCERT students (Classes 5-10).

STRICT RULES:
1. ONLY use the context provided below. DO NOT add external information.
2. If the context doesn't contain the answer, say "I don't have enough information in the provided text."
3. Keep language appropriate for the student's class level.

CONTEXT:
{context}

STUDENT'S QUESTION:
{question}
"""
        
        mode_instructions = {
            "simple": """
MODE: SIMPLE EXPLANATION
- Explain in the simplest possible terms
- Use short sentences
- Avoid complex vocabulary
- Make it easy to understand for a beginner
""",
            "meaning": """
MODE: MEANING/DEFINITION
- Provide clear definitions of key terms
- Explain what each concept means
- Include examples if present in context
""",
            "story": """
MODE: STORY FORMAT
- Present the information as a narrative
- Make it engaging and memorable
- Use storytelling techniques while staying factual
- Only use facts from the context
""",
            "example": """
MODE: EXAMPLES
- Provide practical, real-world examples
- If examples are in context, use them
- If not, clearly state: "The text doesn't provide specific examples"
- Make examples relatable to students
""",
            "summary": """
MODE: SUMMARY
- Provide a concise summary
- Cover all key points from the context
- Use bullet points if appropriate
- Keep it brief and focused
"""
        }
        
        return base_instruction + mode_instructions.get(mode, mode_instructions["simple"])
    
    def generate_mcqs(
        self, 
        context: str, 
        num_questions: int,
        class_level: int,
        subject: str,
        chapter: int
    ) -> list[dict]:
        """
        Generate concept-based MCQs using Gemini.
        
        Args:
            context: Full chapter/section text
            num_questions: Number of MCQs to generate
            class_level: Student's class (5-10)
            subject: Subject name
            chapter: Chapter number
        
        Returns:
            List of MCQ dictionaries
        """
        try:
            prompt = f"""You are creating MCQs for Class {class_level} students studying {subject}, Chapter {chapter}.

STRICT REQUIREMENTS:
1. Generate {num_questions} concept-based multiple-choice questions
2. DO NOT copy-paste sentences directly from the text
3. Test understanding and application, not memorization
4. Each question should have:
   - A clear question
   - 4 options (A, B, C, D)
   - Correct answer index (0-3)
   - Brief explanation of correct answer

CONTEXT FROM CHAPTER:
{context[:3000]}  

OUTPUT FORMAT (JSON):
[
  {{
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "The answer is A because..."
  }},
  ...
]

Generate {num_questions} MCQs now in valid JSON format:"""
            
            response = self.chat_model.generate_content(prompt)
            
            # Parse JSON response
            import json
            # Extract JSON from response (handle markdown code blocks)
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            mcqs = json.loads(text.strip())
            return mcqs
        
        except Exception as e:
            logger.error(f"❌ MCQ generation failed: {e}")
            raise
    
    def evaluate_assessment(
        self,
        questions_and_answers: list[dict],
        class_level: int,
        subject: str,
        chapter: int
    ) -> dict:
        """
        Evaluate voice assessment answers using Gemini AI.
        
        Args:
            questions_and_answers: List of {"question": str, "answer": str}
            class_level: Student's class
            subject: Subject name
            chapter: Chapter number
        
        Returns:
            Evaluation result with score and feedback
        """
        try:
            qa_text = "\n\n".join([
                f"Q{i+1}: {qa['question']}\nA{i+1}: {qa['answer']}"
                for i, qa in enumerate(questions_and_answers)
            ])
            
            prompt = f"""You are evaluating a Class {class_level} student's answers for {subject}, Chapter {chapter}.

EVALUATION CRITERIA:
1. Accuracy (40%) - Is the answer factually correct?
2. Completeness (30%) - Does it cover key points?
3. Understanding (30%) - Does the student demonstrate comprehension?

STUDENT'S ANSWERS:
{qa_text}

PROVIDE:
1. Overall score (0-100)
2. Brief feedback (2-3 sentences)
3. List of strengths (2-3 points)
4. List of improvements needed (2-3 points)
5. Per-question scores (0-100 each)

OUTPUT FORMAT (JSON):
{{
  "score": 75,
  "feedback": "Overall feedback here...",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "question_scores": [
    {{"question_num": 1, "score": 80, "note": "Brief note"}},
    ...
  ]
}}

Provide evaluation in JSON format:"""
            
            response = self.chat_model.generate_content(prompt)
            
            # Parse JSON response
            import json
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            evaluation = json.loads(text.strip())
            return evaluation
        
        except Exception as e:
            logger.error(f"❌ Assessment evaluation failed: {e}")
            raise


# Global Gemini service instance
gemini_service = GeminiService()
