
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ContentInput } from './components/ContentInput';
import { FeatureTabs } from './components/FeatureTabs';
import { ResultDisplay } from './components/ResultDisplay';
import type { Feature, QuizQuestion, Flashcard, StudentLevel, MultipleChoiceQuestion, QuestionDifficulty } from './types';
import { generateSummary, generateQuiz, generateFlashcards, generateStudyPlan, generateQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('Ensino Médio');
  const [activeFeature, setActiveFeature] = useState<Feature>('resumo');
  const [studyPlanDays, setStudyPlanDays] = useState<number>(7);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficultyLevel, setDifficultyLevel] = useState<QuestionDifficulty>('Médio');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    resumo: string;
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    plano: string;
    perguntas: MultipleChoiceQuestion[];
  }>({ resumo: '', quiz: [], flashcards: [], plano: '', perguntas: [] });

  const resetState = () => {
    setInputText('');
    setTextChunks([]);
    setFileName(null);
    setError(null);
    setGeneratedContent({ resumo: '', quiz: [], flashcards: [], plano: '', perguntas: [] });
  };

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      resetState();
      return;
    }

    resetState();
    setIsUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const backendUrl = isLocal ? 'http://localhost:8000/api/v1/upload-pdf/' : '/api/v1/upload-pdf/';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no upload do PDF.');
      }

      const result: { chunks: string[] } = await response.json();
      setInputText(result.chunks.join('\n\n'));
      setTextChunks(result.chunks);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar o PDF.');
      setFileName(null); // Limpa o nome do arquivo em caso de erro
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleGenerate = useCallback(async (featureToGenerate: Feature) => {
    if (!inputText.trim()) {
      setError('Por favor, carregue e processe um PDF antes de gerar conteúdo.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(prev => ({
      ...prev,
      [featureToGenerate]: Array.isArray(prev[featureToGenerate as keyof typeof prev]) ? [] : ''
    }));

    try {
      let result;
      switch (featureToGenerate) {
        case 'resumo':
          // A função de resumo agora usa os chunks para chamar o backend
          result = await generateSummary(textChunks, studentLevel);
          setGeneratedContent(prev => ({ ...prev, resumo: result as string }));
          break;
        case 'quiz':
          result = await generateQuiz(inputText, studentLevel);
          setGeneratedContent(prev => ({ ...prev, quiz: result as QuizQuestion[] }));
          break;
        case 'flashcards':
          result = await generateFlashcards(inputText, studentLevel);
          setGeneratedContent(prev => ({ ...prev, flashcards: result as Flashcard[] }));
          break;
        case 'plano':
          result = await generateStudyPlan(inputText, studentLevel, studyPlanDays);
          setGeneratedContent(prev => ({ ...prev, plano: result as string }));
          break;
        case 'perguntas':
          result = await generateQuestions(inputText, questionCount, difficultyLevel);
          setGeneratedContent(prev => ({ ...prev, perguntas: result as MultipleChoiceQuestion[] }));
          break;
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, textChunks, studentLevel, studyPlanDays, questionCount, difficultyLevel]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 space-y-6">
              <h2 className="text-xl font-bold text-text-primary">Seu Material de Estudo</h2>
              <ContentInput 
                onFileChange={handleFileChange}
                fileName={fileName}
                isUploading={isUploading}
                studentLevel={studentLevel}
                onStudentLevelChange={setStudentLevel}
                activeFeature={activeFeature}
                studyPlanDays={studyPlanDays}
                onStudyPlanDaysChange={setStudyPlanDays}
                questionCount={questionCount}
                onQuestionCountChange={setQuestionCount}
                difficultyLevel={difficultyLevel}
                onDifficultyLevelChange={setDifficultyLevel}
              />
              <div className="bg-surface p-4 rounded-xl shadow-subtle">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Gerar Conteúdo</h2>
                <FeatureTabs 
                  activeFeature={activeFeature}
                  onSelectFeature={setActiveFeature}
                  onGenerate={handleGenerate}
                  isLoading={isGenerating}
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
              isLoading={isGenerating || isUploading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
