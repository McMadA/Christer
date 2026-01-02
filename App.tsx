import React, { useState, useEffect } from 'react';
import { SongCard, GameState } from './types';
import { MOCK_DECK } from './constants';
import CardComponent from './components/CardComponent';
import AudioPlayer from './components/AudioPlayer';
import { RefreshCw, Heart, Trophy, Plus, ArrowRight, Play, Calendar } from 'lucide-react';

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
    // Index 0: Before first card (year <= timeline[0].year)
    // Index i: Between timeline[i-1] and timeline[i]
    // Index length: After last card (year >= timeline[last].year)

    let isCorrect = false;

    if (index === 0) {
      isCorrect = year <= timeline[0].year;
    } else if (index === timeline.length) {
      isCorrect = year >= timeline[timeline.length - 1].year;
    } else {
      const prevYear = timeline[index - 1].year;
      const nextYear = timeline[index].year;
      isCorrect = year >= prevYear && year <= nextYear;
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
        <h1 className="text-5xl font-black mb-4 tracking-tighter">
          Christelijke <br/> <span className="text-emerald-400">HITSTER</span>
        </h1>
        <p className="text-lg mb-8 max-w-md opacity-90">
          Plaats Psalmen, Opwekking en Sela nummers in de juiste tijdlijn. Hoe goed ken jij je klassiekers?
        </p>
        <button 
          onClick={startGame}
          className="bg-white text-indigo-700 font-bold text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
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
        <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
        <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
        <p className="text-xl mb-6">Je score: <span className="font-bold text-emerald-400">{gameState.score}</span></p>
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="font-black text-xl tracking-tight text-indigo-700">HITSTER</div>
           <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">Gospel Editie</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{gameState.score}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-5 h-5 ${i < gameState.lives ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Left/Top Panel: Current Card Area */}
        <section className="bg-slate-50 border-b lg:border-r border-slate-200 lg:w-1/3 p-6 flex flex-col items-center justify-center relative shrink-0">
          
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Huidige Kaart
          </div>

          {gameState.currentCard && (
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
              <AudioPlayer 
                isPlaying={isPlaying} 
                onTogglePlay={() => setIsPlaying(!isPlaying)} 
                previewUrl={gameState.currentCard.spotifyPreviewUrl}
              />
              
              <div className="perspective-1000">
                <CardComponent 
                  card={gameState.currentCard} 
                  isRevealed={gameState.status === 'correct' || gameState.status === 'wrong'} 
                  className="scale-110 shadow-2xl"
                />
              </div>

              {gameState.status === 'correct' && (
                <div className="animate-bounce mt-4 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <span>Goed gedaan!</span>
                  <button onClick={nextTurn} className="ml-2 bg-emerald-600 text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-700 flex items-center">
                    Volgende <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}

              {gameState.status === 'wrong' && (
                <div className="mt-4 bg-rose-100 text-rose-700 px-4 py-2 rounded-lg font-bold text-center">
                  <p>{gameState.feedbackMessage}</p>
                  <button onClick={nextTurn} className="mt-2 bg-rose-600 text-white px-4 py-2 rounded-md text-sm hover:bg-rose-700 flex items-center mx-auto">
                    Volgende <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}

              {gameState.status === 'playing' && (
                <p className="text-sm text-slate-500 text-center animate-pulse">
                  Plaats de kaart in de tijdlijn hieronder 👇
                </p>
              )}
            </div>
          )}
        </section>

        {/* Right/Bottom Panel: Timeline */}
        <section className="flex-grow bg-slate-200/50 p-6 lg:p-10 overflow-y-auto overflow-x-hidden relative">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-slate-500 font-bold mb-6 flex items-center gap-2">
                 <Calendar className="w-5 h-5" /> Tijdlijn
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-4 pb-20">
                {/* 
                  Timeline Layout Strategy:
                  We render buttons BETWEEN cards.
                  [Btn 0] [Card A] [Btn 1] [Card B] [Btn 2]
                */}
                
                <PlacementButton 
                  onClick={() => handleTimelinePlacement(0)} 
                  disabled={gameState.status !== 'playing'}
                  isFirst
                />

                {gameState.timeline.map((card, index) => (
                  <React.Fragment key={card.id}>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-bold text-slate-400 mb-1">{card.year}</div>
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
    return <div className="w-4 h-1 bg-slate-300 rounded-full mx-1 opacity-20"></div>;
  }

  return (
    <button 
      onClick={onClick}
      className={`
        group relative flex items-center justify-center 
        transition-all duration-300 ease-in-out
        ${isFirst ? 'mr-2' : 'mx-2'}
      `}
    >
      <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-transparent group-hover:scale-110 shadow-sm">
        <Plus className="w-6 h-6" />
      </div>
      <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-600 bg-white px-2 py-1 rounded shadow whitespace-nowrap transition-opacity">
        Plaats hier
      </div>
    </button>
  );
};