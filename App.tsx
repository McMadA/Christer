import React, { useState, useEffect } from 'react';
import { SongCard, GameState } from './types';
import { MOCK_DECK } from './constants';
import CardComponent from './components/CardComponent';
import AudioPlayer from './components/AudioPlayer';
import { RefreshCw, Heart, Trophy, Plus, ArrowRight, Play, Calendar, Sparkles } from 'lucide-react';

const INITIAL_LIVES = 3;

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    timeline: [],
    currentCard: null,
    deck: [],
    score: 0,
    lives: INITIAL_LIVES,
    status: 'intro',
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Game
  const startGame = () => {
    // Shuffle Deck
    const shuffled = [...MOCK_DECK].sort(() => Math.random() - 0.5);
    
    // Take first card for timeline
    const firstCard = shuffled.pop()!;
    
    // Take second card for guessing
    const nextCard = shuffled.pop()!;

    setGameState({
      timeline: [firstCard],
      currentCard: nextCard,
      deck: shuffled,
      score: 0,
      lives: INITIAL_LIVES,
      status: 'playing',
    });
    setIsPlaying(false);
  };

  const handleTimelinePlacement = (index: number) => {
    if (!gameState.currentCard) return;

    const { currentCard, timeline } = gameState;
    const year = currentCard.year;

    // Check logic:
    let isCorrect = false;

    // WILDCARD LOGIC: If the card is a Wildcard, it can be placed ANYWHERE.
    if (currentCard.category === 'Wildcard') {
      isCorrect = true;
    } else {
      // Standard logic
      if (index === 0) {
        isCorrect = year <= timeline[0].year;
      } else if (index === timeline.length) {
        isCorrect = year >= timeline[timeline.length - 1].year;
      } else {
        const prevYear = timeline[index - 1].year;
        const nextYear = timeline[index].year;
        isCorrect = year >= prevYear && year <= nextYear;
      }
    }

    if (isCorrect) {
      // Add to timeline at correct position
      const newTimeline = [...timeline];
      newTimeline.splice(index, 0, currentCard);
      
      setGameState(prev => ({
        ...prev,
        status: 'correct',
        timeline: newTimeline,
        score: prev.score + 1
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'wrong',
        lives: prev.lives - 1,
        feedbackMessage: `Fout! Het was ${currentCard.year}.`
      }));
    }
    
    // Stop playing audio when card is placed
    setIsPlaying(false);
  };

  const nextTurn = () => {
    if (gameState.lives <= 0) {
      setGameState(prev => ({ ...prev, status: 'gameover' }));
      return;
    }

    if (gameState.deck.length === 0) {
      setGameState(prev => ({ ...prev, status: 'gameover', feedbackMessage: "Kaarten zijn op!" }));
      return;
    }

    const newDeck = [...gameState.deck];
    const nextCard = newDeck.pop()!;

    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      currentCard: nextCard,
      status: 'playing',
      feedbackMessage: undefined
    }));
    
    // Reset player state for new card
    setIsPlaying(false);
  };

  // Render Screens
  if (gameState.status === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
          Christelijke <br/> <span className="text-emerald-400">HITSTER</span>
        </h1>
        <p className="text-base sm:text-lg mb-8 max-w-md opacity-90 px-4">
          Plaats Psalmen, Opwekking en Sela nummers in de juiste tijdlijn. Hoe goed ken jij je klassiekers?
        </p>
        <button 
          onClick={startGame}
          className="bg-white text-indigo-700 font-bold text-lg sm:text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Play className="w-6 h-6 fill-current" />
          Start Spel
        </button>
      </div>
    );
  }

  if (gameState.status === 'gameover') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 mb-4" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Game Over!</h2>
        <p className="text-lg sm:text-xl mb-6">Je score: <span className="font-bold text-emerald-400">{gameState.score}</span></p>
        <button 
          onClick={startGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Opnieuw Spelen
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-2 sm:p-4 shadow-sm z-20 shrink-0 flex justify-between items-center h-14 sm:h-16 relative">
        <div className="flex items-center gap-2">
           <div className="font-black text-lg sm:text-xl tracking-tight text-indigo-700">HITSTER</div>
           <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold hidden sm:inline-block">Gospel Editie</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1 text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded-md">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-sm sm:text-base">{gameState.score}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i < gameState.lives ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} 
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left/Top Panel: Current Card Area */}
        <section className="bg-slate-50 border-b lg:border-r border-slate-200 lg:w-1/3 p-4 sm:p-6 flex flex-col items-center justify-start lg:justify-center relative shrink-0 z-10 shadow-sm lg:shadow-none max-h-[50vh] lg:max-h-full overflow-y-auto">
          
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-6 w-full text-center">
            Huidige Kaart
          </div>

          {gameState.currentCard && (
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm">
              <AudioPlayer 
                isPlaying={isPlaying} 
                onTogglePlay={() => setIsPlaying(!isPlaying)} 
                previewUrl={gameState.currentCard.spotifyPreviewUrl}
              />
              
              <div className="perspective-1000 relative">
                <CardComponent 
                  card={gameState.currentCard} 
                  isRevealed={gameState.status === 'correct' || gameState.status === 'wrong'} 
                  className="shadow-xl sm:scale-110 sm:my-2"
                />
              </div>

              {/* Special Wildcard Message */}
              {gameState.status === 'playing' && gameState.currentCard.category === 'Wildcard' && (
                <div className="bg-purple-100 border border-purple-200 text-purple-700 px-3 py-2 rounded-lg flex items-center gap-2 animate-pulse text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="font-bold">
                    Wildcard: Plaats waar je wilt!
                  </div>
                </div>
              )}

              {gameState.status === 'correct' && (
                <div className="animate-bounce bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm sm:text-base">
                  <span>Goed gedaan!</span>
                  <button onClick={nextTurn} className="ml-2 bg-emerald-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-emerald-700 flex items-center shadow-sm">
                    Volgende <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                </div>
              )}

              {gameState.status === 'wrong' && (
                <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg font-bold text-center text-sm sm:text-base">
                  <p>{gameState.feedbackMessage}</p>
                  <button onClick={nextTurn} className="mt-2 bg-rose-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-rose-700 flex items-center mx-auto shadow-sm">
                    Volgende <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right/Bottom Panel: Timeline */}
        <section className="flex-1 bg-slate-200/50 p-4 sm:p-6 lg:p-10 overflow-y-auto overflow-x-hidden relative">
           <div className="max-w-4xl mx-auto min-h-full">
              <h2 className="text-slate-500 font-bold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base sticky top-0 bg-slate-200/95 p-2 rounded-lg z-0 backdrop-blur-sm lg:static lg:bg-transparent lg:p-0">
                 <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> Jouw Tijdlijn
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pb-20">
                
                <PlacementButton 
                  onClick={() => handleTimelinePlacement(0)} 
                  disabled={gameState.status !== 'playing'}
                  isFirst
                />

                {gameState.timeline.map((card, index) => (
                  <React.Fragment key={card.id}>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">{card.year}</div>
                      <CardComponent card={card} isRevealed={true} />
                    </div>
                    
                    <PlacementButton 
                      onClick={() => handleTimelinePlacement(index + 1)}
                      disabled={gameState.status !== 'playing'}
                    />
                  </React.Fragment>
                ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

const PlacementButton = ({ onClick, disabled, isFirst }: { onClick: () => void, disabled: boolean, isFirst?: boolean }) => {
  if (disabled) {
    // Hidden spacer when not active to keep layout
    return <div className="w-2 sm:w-4 h-1 bg-slate-300 rounded-full mx-0.5 sm:mx-1 opacity-20"></div>;
  }

  return (
    <button 
      onClick={onClick}
      className={`
        group relative flex items-center justify-center 
        transition-all duration-300 ease-in-out
        ${isFirst ? 'mr-1 sm:mr-2' : 'mx-1 sm:mx-2'}
        touch-manipulation
      `}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-transparent group-hover:scale-110 shadow-sm">
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      {/* Tooltip hidden on mobile to prevent clutter */}
      <div className="hidden sm:block absolute -bottom-6 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-600 bg-white px-2 py-1 rounded shadow whitespace-nowrap transition-opacity">
        Plaats hier
      </div>
    </button>
  );
};