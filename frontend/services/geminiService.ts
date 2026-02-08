
import { apiClient } from './apiClient';
import type { QuizQuestion, Flashcard, StudentLevel, MultipleChoiceQuestion, QuestionDifficulty } from '../types';

// Tipos para as respostas da API
interface SummaryResponse { summary: string; }
interface QuizResponse { quiz: QuizQuestion[]; }
interface FlashcardResponse { flashcards: Flashcard[]; }
interface StudyPlanResponse { plan: string; }
interface QuestionResponse { perguntas: MultipleChoiceQuestion[]; }

export async function generateSummary(chunks: string[], studentLevel: StudentLevel): Promise<string> {
  const response = await apiClient<SummaryResponse>('/generate-summary/', {
    method: 'POST',
    body: JSON.stringify({ chunks, level: studentLevel }),
  });
  return response.summary;
}

export async function generateQuiz(text: string, studentLevel: StudentLevel): Promise<QuizQuestion[]> {
  const response = await apiClient<QuizResponse>('/generate-quiz/', {
    method: 'POST',
    body: JSON.stringify({ text, studentLevel }),
  });
  return response.quiz;
}

export async function generateFlashcards(text: string, studentLevel: StudentLevel): Promise<Flashcard[]> {
  const response = await apiClient<FlashcardResponse>('/generate-flashcards/', {
    method: 'POST',
    body: JSON.stringify({ text, studentLevel }),
  });
  return response.flashcards;
}

export async function generateStudyPlan(text: string, studentLevel: StudentLevel, days: number): Promise<string> {
  const response = await apiClient<StudyPlanResponse>('/generate-study-plan/', {
    method: 'POST',
    body: JSON.stringify({ text, studentLevel, days }),
  });
  return response.plan;
}

export async function generateQuestions(text: string, count: number, difficulty: QuestionDifficulty): Promise<MultipleChoiceQuestion[]> {
  const response = await apiClient<QuestionResponse>('/generate-questions/', {
    method: 'POST',
    body: JSON.stringify({ text, count, difficulty }),
  });
  return response.perguntas;
}
