
import React, { useState } from 'react';
import type { MultipleChoiceQuestion } from '../types';

type AlternativeKey = 'A' | 'B' | 'C' | 'D';

interface McqCardProps {
  question: MultipleChoiceQuestion;
  index: number;
}

const McqCard: React.FC<McqCardProps> = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState<AlternativeKey | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value as AlternativeKey);
    setShowAnswer(false);
  };

  const getOptionClass = (option: AlternativeKey) => {
    if (!showAnswer) return 'border-gray-300';
    if (option === question.resposta_correta) return 'border-green-500 bg-green-50';
    if (selectedOption === option && option !== question.resposta_correta) return 'border-red-500 bg-red-50';
    return 'border-gray-300';
  };

  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4">
        {index + 1}. {question.pergunta}
      </p>
      
      <div className="space-y-3">
        {(Object.keys(question.alternativas) as AlternativeKey[]).map((key) => (
          <label key={key} className={`flex items-start p-3 border rounded-lg cursor-pointer transition ${getOptionClass(key)}`}>
            <input
              type="radio"
              name={`question-${index}`}
              value={key}
              checked={selectedOption === key}
              onChange={handleOptionChange}
              disabled={showAnswer}
              className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-3 text-text-primary"><span className="font-bold">{key})</span> {question.alternativas[key]}</span>
          </label>
        ))}
      </div>

      <button
        onClick={() => setShowAnswer(true)}
        className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition disabled:text-gray-400 disabled:cursor-not-allowed"
        disabled={!selectedOption}
      >
        Ver Resposta
      </button>

      {showAnswer && (
        <div className="mt-4 p-4 bg-primary-light rounded-lg">
          <p className="font-bold text-green-800">Resposta Correta: {question.resposta_correta}</p>
        </div>
      )}
    </div>
  );
};


export const QuestionsView: React.FC<{ questions: MultipleChoiceQuestion[] }> = ({ questions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Banco de Perguntas</h2>
      {questions.map((q, i) => (
        <McqCard key={i} question={q} index={i} />
      ))}
    </div>
  );
};
