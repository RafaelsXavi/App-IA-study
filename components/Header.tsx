
import React from 'react';
import { BrainIcon } from './icons/BrainIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-surface border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-light p-2 rounded-lg">
              <BrainIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">
              Assistente de Estudos IA
            </h1>
          </div>
          {/* Future elements like user profile can go here */}
        </div>
      </div>
    </header>
  );
};
