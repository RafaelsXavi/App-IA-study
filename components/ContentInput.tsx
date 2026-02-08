
import React, { useRef, useState, useCallback } from 'react';
import type { StudentLevel, Feature, QuestionDifficulty } from '../types';
import { studentLevels, questionDifficulties } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ContentInputProps {
  onFileChange: (file: File | null) => void;
  fileName: string | null;
  isUploading: boolean;
  studentLevel: StudentLevel;
  onStudentLevelChange: (level: StudentLevel) => void;
  activeFeature: Feature;
  studyPlanDays: number;
  onStudyPlanDaysChange: (days: number) => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  difficultyLevel: QuestionDifficulty;
  onDifficultyLevelChange: (level: QuestionDifficulty) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({ 
  onFileChange, fileName, isUploading,
  studentLevel, onStudentLevelChange, activeFeature, 
  studyPlanDays, onStudyPlanDaysChange, questionCount, onQuestionCountChange,
  difficultyLevel, onDifficultyLevelChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        onFileChange(file);
      } else {
        // Simple alert for MVP, could be a more elegant toast/notification
        alert('Por favor, selecione um arquivo PDF.');
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const UploadAreaContent = () => {
    if (isUploading) {
      return (
        <div className="text-center">
           <svg className="animate-spin mx-auto h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          <p className="font-semibold text-text-primary">Processando PDF...</p>
          <p className="text-sm text-text-secondary">Isso pode levar alguns segundos.</p>
        </div>
      );
    }
    if (fileName) {
      return (
         <div className="text-center">
            <FileIcon className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="font-semibold text-text-primary truncate" title={fileName}>{fileName}</p>
            <button 
              onClick={() => onFileChange(null)}
              className="mt-2 text-sm text-red-500 hover:text-red-700 font-semibold flex items-center justify-center mx-auto"
            >
              <XCircleIcon className="w-4 h-4 mr-1"/>
              Remover
            </button>
        </div>
      );
    }
    return (
      <div className="text-center">
        <UploadIcon className="w-8 h-8 mx-auto text-text-secondary mb-2" />
        <p className="font-semibold text-text-primary">
          Clique ou arraste e solte o arquivo
        </p>
        <p className="text-sm text-text-secondary">Somente arquivos PDF</p>
      </div>
    );
  };

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

      {activeFeature === 'perguntas' && (
        <div className="bg-surface p-4 rounded-xl shadow-subtle transition-all duration-300 space-y-4">
          <div>
            <label htmlFor="question-count" className="block text-sm font-medium text-text-secondary mb-2">
              Quantidade de Perguntas
            </label>
            <input
              type="number"
              id="question-count"
              value={questionCount}
              onChange={(e) => onQuestionCountChange(Number(e.target.value))}
              min="1"
              max="20"
              className="w-full bg-background border border-gray-300 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="difficulty-level" className="block text-sm font-medium text-text-secondary mb-2">
              Nível de Dificuldade
            </label>
            <select
              id="difficulty-level"
              value={difficultyLevel}
              onChange={(e) => onDifficultyLevelChange(e.target.value as QuestionDifficulty)}
              className="w-full bg-background border border-gray-300 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              {questionDifficulties.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div 
        className={`bg-surface p-4 rounded-xl shadow-subtle border-2 border-dashed flex items-center justify-center h-48 cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-primary'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <UploadAreaContent />
      </div>
    </div>
  );
};
