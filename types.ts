
export type Feature = 'resumo' | 'quiz' | 'flashcards' | 'plano' | 'perguntas';

export type StudentLevel = 'Ensino Fundamental' | 'Ensino Médio' | 'Graduação';
export const studentLevels: StudentLevel[] = ['Ensino Fundamental', 'Ensino Médio', 'Graduação'];

export type QuestionDifficulty = 'Fácil' | 'Médio' | 'Difícil';
export const questionDifficulties: QuestionDifficulty[] = ['Fácil', 'Médio', 'Difícil'];

export interface QuizQuestion {
  pergunta: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'aberta';
  opcoes?: string[];
  resposta_correta: string;
  explicacao: string;
}

export interface Flashcard {
  frente: string;
  verso: string;
}

export interface MultipleChoiceQuestion {
  pergunta: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  resposta_correta: 'A' | 'B' | 'C' | 'D';
}
