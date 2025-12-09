import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';
import { Layers, RotateCw, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const FlashcardGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setCards([]);
    try {
      const generatedCards = await generateFlashcards(topic);
      setCards(generatedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="text-pink-600" /> Flashcard Forge
          </h2>
          <p className="text-slate-500">Generate study sets instantly.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Topic (e.g. Spanish Verbs)"
            className="flex-1 min-w-[200px] px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">Create</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        {isLoading ? (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-pink-400 animate-spin mx-auto" />
            <p className="text-slate-500">Forging knowledge...</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="w-full max-w-xl perspective-1000">
             {/* Counter */}
             <div className="text-center mb-4 text-slate-400 font-medium text-sm">
                Card {currentIndex + 1} of {cards.length}
             </div>

            {/* Card Container */}
            <div 
              className="relative w-full aspect-[3/2] cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: '1000px' }}
            >
              <div className={`
                relative w-full h-full duration-500 transform-style-3d transition-all
                ${isFlipped ? 'rotate-y-180' : ''}
              `} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                
                {/* Front */}
                <div 
                  className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center p-8 text-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Term</span>
                  <h3 className="text-3xl font-bold text-slate-800">{cards[currentIndex].front}</h3>
                  <div className="absolute bottom-6 text-slate-300 text-sm flex items-center gap-1 group-hover:text-pink-400 transition-colors">
                    <RotateCw className="w-4 h-4" /> Click to flip
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white rotate-y-180"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="text-xs font-bold text-pink-300 uppercase tracking-widest mb-4">Definition</span>
                  <p className="text-xl font-medium leading-relaxed">{cards[currentIndex].back}</p>
                  {cards[currentIndex].category && (
                    <span className="absolute bottom-6 px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">
                      {cards[currentIndex].category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-8 mt-10">
              <button 
                onClick={prevCard}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Flip Card Space
              </button>
              <button 
                onClick={nextCard}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center space-y-4 max-w-md mx-auto">
             <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-10 h-10 text-pink-300" />
             </div>
             <h3 className="text-xl font-semibold text-slate-700">No Flashcards Yet</h3>
             <p className="text-slate-500">Enter a topic above to generate a new study set customized for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};