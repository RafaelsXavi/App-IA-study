
import React from 'react';

interface SummaryViewProps {
  summary: string;
}

// A simple component to render text with markdown-like headers and lists
const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    return (
        <div>
            {lines.map((line, index) => {
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-4 mb-2 text-text-primary">{line.substring(3)}</h2>;
                }
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
                }
                return <p key={index} className="my-2">{line}</p>;
            })}
        </div>
    );
};


export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  return (
    <div className="prose max-w-none text-text-secondary">
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Resumo Gerado</h2>
      <SimpleMarkdownRenderer text={summary} />
    </div>
  );
};
