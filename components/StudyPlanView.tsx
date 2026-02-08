
import React from 'react';

interface StudyPlanViewProps {
  plan: string;
}

// A simple component to render text with markdown-like headers and lists
const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return (
        <div className="space-y-2">
            {lines.map((line, index) => {
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-6 mb-2 text-text-primary border-b pb-1 border-gray-200">{line.substring(3)}</h2>;
                }
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
                }
                return <p key={index} className="my-1">{line}</p>;
            })}
        </div>
    );
};


export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ plan }) => {
  return (
    <div className="prose max-w-none text-text-secondary">
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Seu Plano de Estudos Personalizado</h2>
      <SimpleMarkdownRenderer text={plan} />
    </div>
  );
};
