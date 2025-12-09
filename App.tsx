import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TopicExplainer } from './components/TopicExplainer';
import { QuizGenerator } from './components/QuizGenerator';
import { FlashcardGenerator } from './components/FlashcardGenerator';
import { TutorChat } from './components/TutorChat';
import { StudyProvider } from './context/StudyContext';

const App: React.FC = () => {
  return (
    <StudyProvider>
      <HashRouter>
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-auto relative">
            <div className="max-w-7xl mx-auto p-4 md:p-8 h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/explain" element={<TopicExplainer />} />
                <Route path="/quiz" element={<QuizGenerator />} />
                <Route path="/flashcards" element={<FlashcardGenerator />} />
                <Route path="/tutor" element={<TutorChat />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </StudyProvider>
  );
};

export default App;