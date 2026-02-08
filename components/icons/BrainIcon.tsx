
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 9.5v0A2.5 2.5 0 0 1 9.5 12v0A2.5 2.5 0 0 1 12 14.5v0A2.5 2.5 0 0 1 9.5 17v0A2.5 2.5 0 0 1 7 19.5v0A2.5 2.5 0 0 1 9.5 22" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7v0A2.5 2.5 0 0 0 17 9.5v0A2.5 2.5 0 0 0 14.5 12v0A2.5 2.5 0 0 0 12 14.5v0A2.5 2.5 0 0 0 14.5 17v0A2.5 2.5 0 0 0 17 19.5v0A2.5 2.5 0 0 0 14.5 22" />
    <path d="M12 4.5v15" />
  </svg>
);
