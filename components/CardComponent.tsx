import React from 'react';
import { SongCard } from '../types';
import { Music, Calendar, HelpCircle, BookOpen, AlertCircle, Play } from 'lucide-react';

interface CardComponentProps {
  card: SongCard;
  isRevealed: boolean; // If true, shows year. If false, shows "Scan/Play" mode
  onClick?: () => void;
  className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isRevealed, onClick, className = '' }) => {
  
  // Color mapping based on difficulty
  const getBorderColor = () => {
    switch (card.difficulty) {
      case 'Groen': return 'border-emerald-500 bg-emerald-50';
      case 'Geel': return 'border-amber-400 bg-amber-50';
      case 'Rood': return 'border-rose-500 bg-rose-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getBadgeColor = () => {
    switch (card.difficulty) {
      case 'Groen': return 'bg-emerald-500 text-white';
      case 'Geel': return 'bg-amber-400 text-black';
      case 'Rood': return 'bg-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = () => {
    switch (card.category) {
      case 'Periode': return <Calendar className="w-4 h-4" />;
      case 'Herkenning': return <Music className="w-4 h-4" />;
      case 'Inhoud': return <BookOpen className="w-4 h-4" />;
      case 'Wildcard': return <AlertCircle className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative w-40 h-56 rounded-xl border-b-4 shadow-lg flex flex-col items-center justify-between p-3 text-center transition-transform hover:scale-105 cursor-default ${getBorderColor()} ${className}`}
    >
      {/* Category Badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${getBadgeColor()}`}>
          {getCategoryIcon()}
          <span>{card.category}</span>
        </div>
      </div>

      <div className="mt-4 w-full flex-grow flex flex-col items-center justify-center">
        {/* If revealed or it's the current card being played, show Artist/Title */}
        {/* In Hitster, you often scan first (hear audio) then guess. 
            For this webapp, we show artist/title to the "DJ" or player so they can place it. 
            Wait, if it's the current card to guess, we see it, but we DON'T see the year. */}
        
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-3 text-slate-700">
           <Music className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">
          {card.title}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-1">
          {card.artist}
        </p>

        {card.question && (
            <div className="mt-2 text-[10px] text-slate-500 bg-white/50 p-1 rounded">
                "{card.question}"
            </div>
        )}
      </div>

      <div className="w-full border-t border-slate-200 pt-2">
        {isRevealed ? (
          <div className="text-xl font-black text-slate-800">
            {card.year}
          </div>
        ) : (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Raad het jaar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
