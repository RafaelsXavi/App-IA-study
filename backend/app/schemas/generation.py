
from pydantic import BaseModel, Field
from typing import List, Dict, Literal

# --- Quiz Schemas ---
class QuizQuestionSchema(BaseModel):
    pergunta: str
    tipo: str
    opcoes: List[str] | None = None
    resposta_correta: str
    explicacao: str

class QuizRequest(BaseModel):
    text: str
    studentLevel: str

class QuizResponse(BaseModel):
    quiz: List[QuizQuestionSchema]

# --- Flashcard Schemas ---
class FlashcardSchema(BaseModel):
    frente: str
    verso: str

class FlashcardRequest(BaseModel):
    text: str
    studentLevel: str

class FlashcardResponse(BaseModel):
    flashcards: List[FlashcardSchema]

# --- Study Plan Schemas ---
class StudyPlanRequest(BaseModel):
    text: str
    studentLevel: str
    days: int

class StudyPlanResponse(BaseModel):
    plan: str

# --- Questions Schemas ---
class MultipleChoiceQuestionSchema(BaseModel):
    pergunta: str
    alternativas: Dict[Literal['A', 'B', 'C', 'D'], str]
    resposta_correta: Literal['A', 'B', 'C', 'D']

class QuestionRequest(BaseModel):
    text: str
    count: int
    difficulty: str

class QuestionResponse(BaseModel):
    perguntas: List[MultipleChoiceQuestionSchema]
