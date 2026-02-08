
export type Feature = 'resumo' | 'quiz' | 'flashcards' | 'plano';

export type StudentLevel = 'Ensino Fundamental' | 'Ensino Médio' | 'Graduação';

export const studentLevels: StudentLevel[] = ['Ensino Fundamental', 'Ensino Médio', 'Graduação'];

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
