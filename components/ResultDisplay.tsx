
import React from 'react';
import type { Feature, QuizQuestion, Flashcard, MultipleChoiceQuestion } from '../types';
import { SummaryView } from './SummaryView';
import { QuizView } from './QuizView';
import { FlashcardsView } from './FlashcardsView';
import { StudyPlanView } from './StudyPlanView';
import { QuestionsView } from './QuestionsView';
import { EmptyState } from './EmptyState';

interface ResultDisplayProps {
  activeFeature: Feature;
  content: {
    resumo: string;
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    plano: string;
    perguntas: MultipleChoiceQuestion[];
  };
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded-md w-full"></div>
    </div>
     <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
    </div>
  </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ activeFeature, content, isLoading }) => {
  const isContentEmpty = 
    (activeFeature === 'resumo' && !content.resumo) ||
    (activeFeature === 'quiz' && content.quiz.length === 0) ||
    (activeFeature === 'flashcards' && content.flashcards.length === 0) ||
    (activeFeature === 'plano' && !content.plano) ||
    (activeFeature === 'perguntas' && content.perguntas.length === 0);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    
    if (isContentEmpty) {
      return <EmptyState />;
    }

    switch (activeFeature) {
      case 'resumo':
        return <SummaryView summary={content.resumo} />;
      case 'quiz':
        return <QuizView questions={content.quiz} />;
      case 'flashcards':
        return <FlashcardsView flashcards={content.flashcards} />;
      case 'plano':
        return <StudyPlanView plan={content.plano} />;
      case 'perguntas':
        return <QuestionsView questions={content.perguntas} />;
      default:
        return <EmptyState />;
    }
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-subtle min-h-[60vh]">
      {renderContent()}
    </div>
  );
};
