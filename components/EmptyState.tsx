
import React from 'react';
import { BrainIcon } from './icons/BrainIcon';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary py-16">
      <div className="bg-primary-light p-4 rounded-full mb-4">
        <BrainIcon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary">Pronto para começar?</h3>
      <p className="mt-2 max-w-sm">
        Cole seu material de estudo, escolha uma ferramenta e clique em 'Gerar' para transformar seu conteúdo em resumos, quizzes ou flashcards interativos.
      </p>
    </div>
  );
};
