
import React from 'react';
import type { StudentLevel, Feature } from '../types';
import { studentLevels } from '../types';

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  studentLevel: StudentLevel;
  onStudentLevelChange: (level: StudentLevel) => void;
  activeFeature: Feature;
  studyPlanDays: number;
  onStudyPlanDaysChange: (days: number) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({ value, onChange, studentLevel, onStudentLevelChange, activeFeature, studyPlanDays, onStudyPlanDaysChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-surface p-4 rounded-xl shadow-subtle">
        <label htmlFor="student-level" className="block text-sm font-medium text-text-secondary mb-2">
          Nível de Estudo
        </label>
        <select
          id="student-level"
          value={studentLevel}
          onChange={(e) => onStudentLevelChange(e.target.value as StudentLevel)}
          className="w-full bg-background border border-gray-300 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        >
          {studentLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {activeFeature === 'plano' && (
        <div className="bg-surface p-4 rounded-xl shadow-subtle transition-all duration-300">
          <label htmlFor="study-plan-days" className="block text-sm font-medium text-text-secondary mb-2">
            Duração do Plano (dias)
          </label>
          <input
            type="number"
            id="study-plan-days"
            value={studyPlanDays}
            onChange={(e) => onStudyPlanDaysChange(Number(e.target.value))}
            min="1"
            max="30"
            className="w-full bg-background border border-gray-300 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
      )}

      <div className="bg-surface p-4 rounded-xl shadow-subtle">
        <label htmlFor="content-input" className="block text-sm font-medium text-text-secondary mb-2">
          Cole seu material de estudo aqui
        </label>
        <textarea
          id="content-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Comece colando o texto do seu livro, artigo ou anotações..."
          className="w-full h-64 bg-background border border-gray-300 rounded-lg p-3 text-text-primary placeholder-text-secondary resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
        <p className="text-xs text-text-secondary mt-2">
          Em breve: suporte para upload de arquivos PDF!
        </p>
      </div>
    </div>
  );
};
