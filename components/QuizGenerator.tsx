import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, QuizState } from '../types';
import { useStudyContext } from '../context/StudyContext';
import { CheckCircle2, XCircle, Trophy, GraduationCap, ArrowRight, RefreshCw, Loader2, Star } from 'lucide-react';

export const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [state, setState] = useState<QuizState>(QuizState.Setup);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState('');
  
  // Real-time tracking
  const { incrementTopicsMastered } = useStudyContext();

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setState(QuizState.Loading);
    setError('');
    try {
      const generatedQuestions = await generateQuiz(topic, 5);
      setQuestions(generatedQuestions);
      setCurrentQIndex(0);
      setScore(0);
      setState(QuizState.Active);
    } catch (err) {
      setError('Unable to create quiz. Please try again.');
      setState(QuizState.Setup);
    }
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(i => i + 1);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = () => {
    // Check mastery ( >= 80% )
    // Note: score is already updated for the current question
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 80) {
      incrementTopicsMastered();
    }
    setState(QuizState.Review);
  };

  const resetQuiz = () => {
    setState(QuizState.Setup);
    setTopic('');
    setQuestions([]);
    setSelectedOption(null);
  };

  // 1. Setup View
  if (state === QuizState.Setup) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pt-8 text-center">
        <div className="inline-block p-4 bg-violet-100 text-violet-600 rounded-2xl mb-4">
          <GraduationCap className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Quiz Master</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Test your knowledge. Enter a topic, and AI will generate a unique multiple-choice quiz for you instantly.
        </p>
        
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center pl-4 max-w-lg mx-auto">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            placeholder="Enter a topic (e.g. World Geography)"
            className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 py-2"
          />
          <button 
            onClick={startQuiz}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Start
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  // 2. Loading View
  if (state === QuizState.Loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
        <p className="text-slate-600 font-medium">Generating questions about "{topic}"...</p>
      </div>
    );
  }

  // 3. Review/Results View
  if (state === QuizState.Review) {
    const percentage = Math.round((score / questions.length) * 100);
    const isMastered = percentage >= 80;
    
    return (
      <div className="max-w-lg mx-auto pt-10 text-center space-y-8 animate-fade-in">
        <div className="relative inline-block">
          <Trophy className={`w-20 h-20 mx-auto ${percentage >= 70 ? 'text-yellow-500' : 'text-slate-300'}`} />
          {isMastered && (
             <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full animate-bounce">
                <Star size={16} fill="currentColor" />
             </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
          <p className="text-slate-500 mt-2">You scored</p>
          <div className="text-5xl font-black text-violet-600 mt-2 mb-4">{percentage}%</div>
          <p className="text-sm text-slate-400 mb-4">({score} out of {questions.length} correct)</p>
          
          {isMastered ? (
             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-medium text-sm">
                <CheckCircle2 size={16} /> Topic Mastered!
             </div>
          ) : (
             <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-full font-medium text-sm">
                Keep practicing to master this topic.
             </div>
          )}
        </div>
        <button 
          onClick={resetQuiz}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Another
        </button>
      </div>
    );
  }

  // 4. Active Quiz View
  const question = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto pt-4 space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-violet-600 h-full transition-all duration-500"
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-end text-sm text-slate-500 font-medium">
        <span>Question {currentQIndex + 1} of {questions.length}</span>
        <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
          {topic}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-violet-300 hover:bg-violet-50";
            if (selectedOption !== null) {
              if (idx === question.correctAnswerIndex) stateClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
              else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 ring-1 ring-red-500";
              else stateClass = "border-slate-100 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${stateClass}`}
              >
                <span className={selectedOption !== null && idx === question.correctAnswerIndex ? "font-semibold text-green-800" : "text-slate-700"}>
                  {option}
                </span>
                {selectedOption !== null && idx === question.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {selectedOption !== null && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Next Button */}
      {showExplanation && (
        <div className="animate-fade-in space-y-4">
          <div className={`p-4 rounded-xl border ${selectedOption === question.correctAnswerIndex ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
            <p className="font-semibold mb-1">{selectedOption === question.correctAnswerIndex ? 'Correct!' : 'Incorrect'}</p>
            <p className="text-sm opacity-90">{question.explanation}</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={nextQuestion}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              {currentQIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};