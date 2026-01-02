import React from 'react';
import { SongCard } from '../types';
import { Music, Calendar, HelpCircle, BookOpen, AlertCircle, Play, Sparkles } from 'lucide-react';

interface CardComponentProps {
  card: SongCard;
  isRevealed: boolean; // If true, shows year. If false, shows "Scan/Play" mode
  onClick?: () => void;
  className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isRevealed, onClick, className = '' }) => {
  
  // Color mapping based on difficulty
  const getBorderColor = () => {
    if (card.category === 'Wildcard') return 'border-purple-500 bg-purple-50'; // Wildcard overrides difficulty color
    switch (card.difficulty) {
      case 'Groen': return 'border-emerald-500 bg-emerald-50';
      case 'Geel': return 'border-amber-400 bg-amber-50';
      case 'Rood': return 'border-rose-500 bg-rose-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getBadgeColor = () => {
    if (card.category === 'Wildcard') return 'bg-purple-600 text-white';
    switch (card.difficulty) {
      case 'Groen': return 'bg-emerald-500 text-white';
      case 'Geel': return 'bg-amber-400 text-black';
      case 'Rood': return 'bg-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = () => {
    switch (card.category) {
      case 'Periode': return <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Herkenning': return <Music className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Inhoud': return <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Wildcard': return <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Music className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative w-32 h-48 sm:w-40 sm:h-56 rounded-xl border-b-4 shadow-lg flex flex-col items-center justify-between p-2 sm:p-3 text-center transition-transform hover:scale-105 cursor-default ${getBorderColor()} ${className}`}
    >
      {/* Category Badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap ${getBadgeColor()}`}>
          {getCategoryIcon()}
          <span>{card.category}</span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 w-full flex-grow flex flex-col items-center justify-center overflow-hidden">
        {/* Icon based on category */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md mb-2 sm:mb-3 text-slate-700 shrink-0 ${card.category === 'Wildcard' ? 'bg-purple-100 text-purple-600' : 'bg-white'}`}>
           {card.category === 'Wildcard' ? <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> : <Music className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>

        <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight mb-1 line-clamp-2 w-full px-1">
          {card.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-600 line-clamp-1 w-full px-1">
          {card.artist}
        </p>

        {card.question && (
            <div className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-slate-500 bg-white/50 p-1 rounded leading-tight">
                "{card.question}"
            </div>
        )}
      </div>

      <div className="w-full border-t border-slate-200 pt-1 sm:pt-2">
        {isRevealed ? (
          <div className="text-lg sm:text-xl font-black text-slate-800">
            {card.year}
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Raad het jaar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;