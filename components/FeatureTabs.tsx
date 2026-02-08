
import React from 'react';
import type { Feature } from '../types';
import { BookIcon } from './icons/BookIcon';
import { ListIcon } from './icons/ListIcon';
import { CardsIcon } from './icons/CardsIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { QuestionIcon } from './icons/QuestionIcon';

interface FeatureTab {
  id: Feature;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureTab[] = [
  { id: 'resumo', label: 'Resumo', icon: BookIcon },
  { id: 'quiz', label: 'Quiz', icon: ListIcon },
  { id: 'flashcards', label: 'Flashcards', icon: CardsIcon },
  { id: 'plano', label: 'Plano', icon: CalendarIcon },
  { id: 'perguntas', label: 'Perguntas', icon: QuestionIcon },
];

interface FeatureTabsProps {
  activeFeature: Feature;
  onSelectFeature: (feature: Feature) => void;
  onGenerate: (feature: Feature) => void;
  isLoading: boolean;
  isInputEmpty: boolean;
}

export const FeatureTabs: React.FC<FeatureTabsProps> = ({ activeFeature, onSelectFeature, onGenerate, isLoading, isInputEmpty }) => {
  const handleGenerateClick = () => {
    if (!isLoading) {
      onGenerate(activeFeature);
    }
  };

  // Adjust grid columns based on number of features
  const gridColsClass = features.length > 4 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className="space-y-4">
      <div className={`grid ${gridColsClass} gap-2 bg-background p-1 rounded-lg`}>
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onSelectFeature(feature.id)}
            className={`flex-1 text-sm font-semibold py-2 px-1 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              activeFeature === feature.id
                ? 'bg-primary text-white shadow'
                : 'text-text-secondary hover:bg-gray-200'
            }`}
          >
            <feature.icon className="h-5 w-5" />
            <span>{feature.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleGenerateClick}
        disabled={isLoading || isInputEmpty}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out enabled:hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            Gerar {features.find(f => f.id === activeFeature)?.label}
          </>
        )}
      </button>
    </div>
  );
};
