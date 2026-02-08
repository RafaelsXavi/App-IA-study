
import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    setShowAnswer(false);
  };

  const getOptionClass = (option: string) => {
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
      
      {question.tipo === 'multipla_escolha' && question.opcoes && (
        <div className="space-y-3">
          {question.opcoes.map((option, i) => (
            <label key={i} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${getOptionClass(option)}`}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                disabled={showAnswer}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-3 text-text-primary">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.tipo === 'verdadeiro_falso' && (
        <div className="space-y-3">
          {['Verdadeiro', 'Falso'].map((option, i) => (
             <label key={i} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${getOptionClass(option)}`}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                disabled={showAnswer}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-3 text-text-primary">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.tipo === 'aberta' && (
        <div>
          <textarea
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Digite sua resposta aqui..."
          />
        </div>
      )}

      <button
        onClick={() => setShowAnswer(true)}
        className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition"
      >
        Ver Resposta
      </button>

      {showAnswer && (
        <div className="mt-4 p-4 bg-primary-light rounded-lg">
          <p className="font-bold text-green-800">Resposta Correta: {question.resposta_correta}</p>
          <p className="mt-2 text-sm text-text-secondary">{question.explicacao}</p>
        </div>
      )}
    </div>
  );
};


export const QuizView: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Quiz Interativo</h2>
      {questions.map((q, i) => (
        <QuestionCard key={i} question={q} index={i} />
      ))}
    </div>
  );
};
