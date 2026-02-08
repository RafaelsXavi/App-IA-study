
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ContentInput } from './components/ContentInput';
import { FeatureTabs } from './components/FeatureTabs';
import { ResultDisplay } from './components/ResultDisplay';
import type { Feature, QuizQuestion, Flashcard, StudentLevel } from './types';
import { generateSummary, generateQuiz, generateFlashcards, generateStudyPlan } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('Ensino Médio');
  const [activeFeature, setActiveFeature] = useState<Feature>('resumo');
  const [studyPlanDays, setStudyPlanDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    resumo: string;
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    plano: string;
  }>({ resumo: '', quiz: [], flashcards: [], plano: '' });

  const handleGenerate = useCallback(async (featureToGenerate: Feature) => {
    if (!inputText.trim()) {
      setError('Por favor, insira o material de estudo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(prev => ({
      ...prev, // Keep old content for other tabs
      [featureToGenerate]: featureToGenerate === 'quiz' ? [] : (featureToGenerate === 'flashcards' ? [] : '')
    }));

    try {
      let result;
      switch (featureToGenerate) {
        case 'resumo':
          result = await generateSummary(inputText, studentLevel);
          setGeneratedContent(prev => ({ ...prev, resumo: result }));
          break;
        case 'quiz':
          result = await generateQuiz(inputText, studentLevel);
          setGeneratedContent(prev => ({ ...prev, quiz: result }));
          break;
        case 'flashcards':
          result = await generateFlashcards(inputText, studentLevel);
          setGeneratedContent(prev => ({ ...prev, flashcards: result }));
          break;
        case 'plano':
          result = await generateStudyPlan(inputText, studentLevel, studyPlanDays);
          setGeneratedContent(prev => ({ ...prev, plano: result }));
          break;
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, studentLevel, studyPlanDays]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 space-y-6">
              <h2 className="text-xl font-bold text-text-primary">Seu Material de Estudo</h2>
              <ContentInput 
                value={inputText}
                onChange={setInputText}
                studentLevel={studentLevel}
                onStudentLevelChange={setStudentLevel}
                activeFeature={activeFeature}
                studyPlanDays={studyPlanDays}
                onStudyPlanDaysChange={setStudyPlanDays}
              />
              <div className="bg-surface p-4 rounded-xl shadow-subtle">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Gerar Conteúdo</h2>
                <FeatureTabs 
                  activeFeature={activeFeature}
                  onSelectFeature={setActiveFeature}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  isInputEmpty={!inputText.trim()}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
             {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Erro: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <ResultDisplay
              activeFeature={activeFeature}
              content={generatedContent}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
