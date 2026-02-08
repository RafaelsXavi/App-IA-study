
import React, { useState } from 'react';
import type { Flashcard } from '../types';

interface FlashcardCardProps {
  flashcard: Flashcard;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 h-64 w-full" onClick={() => setIsFlipped(!isFlipped)}>
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Frente */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-subtle">
          <p className="text-lg font-semibold text-center text-text-primary">{flashcard.frente}</p>
        </div>

        {/* Verso */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-primary-light border border-primary rounded-xl shadow-subtle rotate-y-180">
          <p className="text-center text-text-primary">{flashcard.verso}</p>
        </div>
      </div>
    </div>
  );
};


export const FlashcardsView: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Flashcards</h2>
       <p className="text-text-secondary mb-6 -mt-4">Clique nos cards para virar.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((fc, i) => (
          <FlashcardCard key={i} flashcard={fc} />
        ))}
      </div>
    </div>
  );
};

// Add some CSS for the 3D effect
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-preserve-3d { transform-style: preserve-3d; }
  .rotate-y-180 { transform: rotateY(180deg); }
  .backface-hidden { backface-visibility: hidden; }
`;
document.head.appendChild(style);
