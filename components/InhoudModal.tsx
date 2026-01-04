import React, { useState, useEffect } from 'react';
import { SongCard } from '../types';
import { BookOpen, Check, X, SkipForward } from 'lucide-react';

interface InhoudModalProps {
  card: SongCard;
  isOpen: boolean;
  allCards: SongCard[]; // Used to generate wrong answer options
  onAnswer: (correct: boolean) => void;
  onSkip: () => void;
}

interface AnswerOption {
  title: string;
  artist: string;
  isCorrect: boolean;
}

const InhoudModal: React.FC<InhoudModalProps> = ({
  card,
  isOpen,
  allCards,
  onAnswer,
  onSkip
}) => {
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Generate answer options when card changes
  useEffect(() => {
    if (!isOpen || !card) return;

    // Get wrong answers from other cards (different songs)
    const wrongAnswers = allCards
      .filter(c => c.id !== card.id && c.title !== card.title)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => ({
        title: c.title,
        artist: c.artist,
        isCorrect: false
      }));

    // Add correct answer
    const correctAnswer: AnswerOption = {
      title: card.title,
      artist: card.artist,
      isCorrect: true
    };

    // Shuffle all options
    const allOptions = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [card, isOpen, allCards]);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return; // Already answered
    setSelectedAnswer(index);
    setShowResult(true);

    // Auto-proceed after delay
    setTimeout(() => {
      onAnswer(options[index].isCorrect);
    }, 1500);
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Inhoud Vraag</h2>
              <p className="text-orange-100 text-sm">Raad het lied!</p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-4 bg-orange-50 border-b border-orange-100">
          <p className="text-slate-800 font-medium text-center leading-relaxed">
            "{card.question}"
          </p>
        </div>

        {/* Answer Options */}
        <div className="p-4 space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const showCorrect = showResult && option.isCorrect;
            const showWrong = showResult && isSelected && !option.isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  showCorrect
                    ? 'border-emerald-500 bg-emerald-50'
                    : showWrong
                    ? 'border-rose-500 bg-rose-50'
                    : isSelected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                } ${showResult ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${showCorrect ? 'text-emerald-700' : showWrong ? 'text-rose-700' : 'text-slate-800'}`}>
                      {option.title}
                    </p>
                    <p className={`text-sm ${showCorrect ? 'text-emerald-600' : showWrong ? 'text-rose-600' : 'text-slate-500'}`}>
                      {option.artist}
                    </p>
                  </div>
                  {showCorrect && (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {showWrong && (
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result message */}
        {showResult && (
          <div className={`mx-4 mb-4 p-3 rounded-xl text-center ${
            options[selectedAnswer!]?.isCorrect
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {options[selectedAnswer!]?.isCorrect ? (
              <p className="font-semibold">Goed! +5 bonus punten!</p>
            ) : (
              <p className="font-semibold">Helaas, dat was niet juist.</p>
            )}
          </div>
        )}

        {/* Skip Button */}
        {!showResult && (
          <div className="p-4 pt-0">
            <button
              onClick={handleSkip}
              className="w-full py-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              <span>Vraag overslaan</span>
            </button>
          </div>
        )}

        {/* Footer hint */}
        <div className="px-4 pb-4 text-center text-xs text-slate-400">
          Beantwoord de vraag voor bonus punten, of sla over om direct te plaatsen
        </div>
      </div>
    </div>
  );
};

export default InhoudModal;
