import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateExplanation } from '../services/geminiService';
import { DifficultyLevel } from '../types';
import { Sparkles, BookOpen, ChevronDown, Loader2 } from 'lucide-react';

export const TopicExplainer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<DifficultyLevel>(DifficultyLevel.Intermediate);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError('');
    setContent(null);

    try {
      const result = await generateExplanation(topic, level);
      setContent(result);
    } catch (err) {
      setError('Failed to generate explanation. Please check your API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <BookOpen className="text-indigo-600" /> Deep Dive
        </h2>
        <p className="text-slate-500">Master any subject with tailored AI explanations.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">What do you want to learn?</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Entanglement, French Revolution, Photosynthesis..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as DifficultyLevel)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(DifficultyLevel).map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Explain It
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Content Display */}
      {content && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <div className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-xl">
             <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};