import React, { useState, useEffect } from 'react';
import {
  SongCard,
  GameState,
  Player,
  GameDifficulty,
  GameStatus,
  PLAYER_COLORS,
  DIFFICULTY_SETTINGS,
  getCurrentPlayer,
  SCORING,
} from './types';
import { MOCK_DECK } from './constants';
import { shuffleArray } from './utils/shuffle';
import { calculateScore, getStreakText, hasStreakBonus } from './utils/scoring';
import { validatePlacement } from './utils/validation';
import CardComponent from './components/CardComponent';
import AudioPlayer from './components/AudioPlayer';
import InhoudModal from './components/InhoudModal';
import ScorePopup from './components/ScorePopup';
import {
  playCorrect,
  playWrong,
  playStreak,
  playTurn,
  playGameOver,
  playLifeLost,
  playQuestionCorrect,
  playQuestionWrong,
  playCardDraw,
  initAudio,
} from './utils/sounds';
import {
  RefreshCw,
  Heart,
  Trophy,
  Plus,
  ArrowRight,
  Play,
  Calendar,
  Sparkles,
  Users,
  Zap,
  Crown,
} from 'lucide-react';

const createInitialState = (): GameState => ({
  status: 'intro',
  difficulty: 'medium',
  players: [],
  currentPlayerIndex: 0,
  currentCard: null,
  deck: [],
  timeline: [],
  feedbackMessage: undefined,
  lastScoreEvents: undefined,
  winner: undefined,
});

export default function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);

  // Inhoud modal state
  const [showInhoudModal, setShowInhoudModal] = useState(false);
  const [inhoudAnsweredCorrectly, setInhoudAnsweredCorrectly] = useState(false);

  // Score popup state for animations
  const [scorePopup, setScorePopup] = useState<{ points: number; x: number; y: number } | null>(null);

  // Get current player helper
  const currentPlayer = getCurrentPlayer(gameState);

  // Initialize audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  // Handle difficulty selection
  const selectDifficulty = (difficulty: GameDifficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      status: 'player-setup',
    }));
  };

  // Handle player count change
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(prev => {
      const newNames = [...prev];
      while (newNames.length < count) newNames.push('');
      return newNames.slice(0, count);
    });
  };

  // Start the game with configured players
  const startGame = () => {
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    // Filter deck by difficulty
    const filteredDeck = MOCK_DECK.filter(card =>
      settings.allowedCardDifficulties.includes(card.difficulty) ||
      card.category === 'Wildcard'
    );

    // Shuffle deck
    const shuffled = shuffleArray(filteredDeck);

    // Take first card for timeline
    const firstCard = shuffled.pop();
    if (!firstCard) {
      console.error('No cards in deck');
      return;
    }

    // Take second card for first player
    const nextCard = shuffled.pop();
    if (!nextCard) {
      console.error('Not enough cards in deck');
      return;
    }

    // Create players
    const players: Player[] = playerNames.slice(0, playerCount).map((name, index) => ({
      id: `player-${index}`,
      name: name.trim() || `Speler ${index + 1}`,
      color: PLAYER_COLORS[index],
      score: 0,
      lives: settings.lives,
      streakCount: 0,
      isEliminated: false,
    }));

    // Play card draw sound
    playCardDraw();

    setGameState({
      ...gameState,
      status: 'playing',
      players,
      currentPlayerIndex: 0,
      timeline: [firstCard],
      currentCard: nextCard,
      deck: shuffled,
      feedbackMessage: undefined,
      lastScoreEvents: undefined,
      winner: undefined,
    });
    setIsPlaying(false);
    setInhoudAnsweredCorrectly(false);

    // Check if first card is Inhoud - show modal
    if (nextCard.category === 'Inhoud' && nextCard.question) {
      setTimeout(() => setShowInhoudModal(true), 300);
    }
  };

  // Handle Inhoud modal answer
  const handleInhoudAnswer = (correct: boolean) => {
    setInhoudAnsweredCorrectly(correct);
    setShowInhoudModal(false);
    if (correct) {
      playQuestionCorrect();
    } else {
      playQuestionWrong();
    }
  };

  // Handle Inhoud modal skip
  const handleInhoudSkip = () => {
    setInhoudAnsweredCorrectly(false);
    setShowInhoudModal(false);
  };

  // Handle card placement
  const handleTimelinePlacement = (insertIndex: number) => {
    if (!gameState.currentCard || !currentPlayer) return;

    const result = validatePlacement(gameState.currentCard, gameState.timeline, insertIndex);

    if (result.isCorrect) {
      // Calculate score with Inhoud bonus
      const newStreakCount = currentPlayer.streakCount + 1;
      const scoreResult = calculateScore(
        gameState.currentCard,
        newStreakCount,
        gameState.difficulty,
        inhoudAnsweredCorrectly
      );

      // Play sounds
      playCorrect();

      // Check if streak milestone achieved
      const hadStreakBefore = hasStreakBonus(currentPlayer.streakCount);
      const hasStreakNow = hasStreakBonus(newStreakCount);
      if (!hadStreakBefore && hasStreakNow) {
        setTimeout(() => playStreak(), 300);
      }

      // Insert card into timeline at correct position
      const newTimeline = [...gameState.timeline];
      newTimeline.splice(insertIndex, 0, gameState.currentCard);

      // Update player
      const updatedPlayers = gameState.players.map((p, i) =>
        i === gameState.currentPlayerIndex
          ? {
              ...p,
              score: p.score + scoreResult.totalPoints,
              streakCount: newStreakCount,
            }
          : p
      );

      setGameState(prev => ({
        ...prev,
        status: 'correct',
        timeline: newTimeline,
        players: updatedPlayers,
        feedbackMessage: result.message,
        lastScoreEvents: scoreResult.events,
      }));
    } else {
      // Wrong placement - play sounds
      playWrong();
      if (currentPlayer.lives <= 1) {
        setTimeout(() => playLifeLost(), 200);
      }

      // Wrong placement
      const updatedPlayers = gameState.players.map((p, i) =>
        i === gameState.currentPlayerIndex
          ? {
              ...p,
              lives: p.lives - 1,
              streakCount: 0,
              isEliminated: p.lives - 1 <= 0,
            }
          : p
      );

      setGameState(prev => ({
        ...prev,
        status: 'wrong',
        players: updatedPlayers,
        feedbackMessage: result.message,
        lastScoreEvents: undefined,
      }));
    }

    setIsPlaying(false);
    setInhoudAnsweredCorrectly(false); // Reset for next card
  };

  // Proceed to next turn
  const nextTurn = () => {
    // Check if game should end
    const activePlayers = gameState.players.filter(p => !p.isEliminated);

    if (activePlayers.length === 0 || gameState.deck.length === 0) {
      // Determine winner (highest score among non-eliminated, or highest overall if all eliminated)
      const candidates = activePlayers.length > 0 ? activePlayers : gameState.players;
      const winner = candidates.reduce((prev, current) =>
        current.score > prev.score ? current : prev
      );

      // Play game over sound
      playGameOver(activePlayers.length > 0);

      setGameState(prev => ({
        ...prev,
        status: 'gameover',
        winner,
      }));
      return;
    }

    // Find next active player
    let nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    while (gameState.players[nextIndex].isEliminated) {
      nextIndex = (nextIndex + 1) % gameState.players.length;
    }

    // Draw next card
    const newDeck = [...gameState.deck];
    const nextCard = newDeck.pop();

    if (!nextCard) {
      // No more cards - end game
      const winner = activePlayers.reduce((prev, current) =>
        current.score > prev.score ? current : prev
      );
      playGameOver(true);
      setGameState(prev => ({
        ...prev,
        status: 'gameover',
        winner,
      }));
      return;
    }

    // Play sounds
    playCardDraw();
    // Play turn sound only in multiplayer when switching players
    if (gameState.players.length > 1 && nextIndex !== gameState.currentPlayerIndex) {
      playTurn();
    }

    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      currentCard: nextCard,
      currentPlayerIndex: nextIndex,
      status: 'playing',
      feedbackMessage: undefined,
      lastScoreEvents: undefined,
    }));
    setIsPlaying(false);
    setInhoudAnsweredCorrectly(false);

    // Check if next card is Inhoud - show modal
    if (nextCard.category === 'Inhoud' && nextCard.question) {
      setTimeout(() => setShowInhoudModal(true), 300);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState(createInitialState());
    setIsPlaying(false);
    setPlayerNames(['', '']);
    setPlayerCount(2);
  };

  // ==================== RENDER SCREENS ====================

  // Intro Screen
  if (gameState.status === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
          Christelijke <br />
          <span className="text-emerald-400">HITSTER</span>
        </h1>
        <p className="text-base sm:text-lg mb-8 max-w-md opacity-90 px-4">
          Plaats Psalmen, Opwekking en Sela nummers in de juiste tijdlijn. Hoe goed ken jij je klassiekers?
        </p>
        <button
          onClick={() => setGameState(prev => ({ ...prev, status: 'difficulty-select' }))}
          className="bg-white text-indigo-700 font-bold text-lg sm:text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Play className="w-6 h-6 fill-current" />
          Start Spel
        </button>
      </div>
    );
  }

  // Difficulty Selection Screen
  if (gameState.status === 'difficulty-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2">
          <Zap className="w-8 h-8 text-amber-400" />
          Kies Moeilijkheid
        </h2>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(difficulty => {
            const settings = DIFFICULTY_SETTINGS[difficulty];
            const colors = {
              easy: 'from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500',
              medium: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500',
              hard: 'from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500',
            };

            return (
              <button
                key={difficulty}
                onClick={() => selectDifficulty(difficulty)}
                className={`w-full p-4 rounded-xl bg-gradient-to-r ${colors[difficulty]} text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-all flex flex-col items-start`}
              >
                <span className="text-xl">{settings.label}</span>
                <span className="text-sm opacity-90 font-normal">{settings.description}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setGameState(prev => ({ ...prev, status: 'intro' }))}
          className="mt-8 text-slate-400 hover:text-white transition-colors"
        >
          &larr; Terug
        </button>
      </div>
    );
  }

  // Player Setup Screen
  if (gameState.status === 'player-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-400" />
          Spelers
        </h2>

        {/* Player count selector */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map(count => (
            <button
              key={count}
              onClick={() => handlePlayerCountChange(count)}
              className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                playerCount === count
                  ? 'bg-blue-500 text-white scale-110'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="text-slate-400 text-sm mb-6">Aantal spelers</p>

        {/* Player name inputs */}
        <div className="flex flex-col gap-3 w-full max-w-sm mb-8">
          {playerNames.slice(0, playerCount).map((name, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{ backgroundColor: PLAYER_COLORS[index] }}
              />
              <input
                type="text"
                placeholder={`Speler ${index + 1}`}
                value={name}
                onChange={e => {
                  const newNames = [...playerNames];
                  newNames[index] = e.target.value;
                  setPlayerNames(newNames);
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Play className="w-6 h-6" />
          Start Spel
        </button>

        <button
          onClick={() => setGameState(prev => ({ ...prev, status: 'difficulty-select' }))}
          className="mt-6 text-slate-400 hover:text-white transition-colors"
        >
          &larr; Terug
        </button>
      </div>
    );
  }

  // Game Over Screen
  if (gameState.status === 'gameover') {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 mb-4" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Spel Afgelopen!</h2>

        {gameState.winner && (
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-xl">
              <span style={{ color: gameState.winner.color }}>{gameState.winner.name}</span> wint!
            </span>
          </div>
        )}

        {/* Scoreboard */}
        <div className="w-full max-w-sm mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                index === 0 ? 'bg-yellow-500/20' : 'bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className={player.isEliminated ? 'line-through text-slate-500' : ''}>
                  {player.name}
                </span>
              </div>
              <span className="font-bold text-emerald-400">{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Opnieuw Spelen
        </button>
      </div>
    );
  }

  // ==================== MAIN GAME SCREEN ====================
  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white px-3 py-2 sm:px-4 shadow-sm z-20 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="font-black text-lg sm:text-xl tracking-tight text-indigo-700">HITSTER</div>
            <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold hidden sm:inline-block">
              Gospel Editie
            </span>
          </div>

          {/* Player indicators */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {gameState.players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all ${
                  index === gameState.currentPlayerIndex
                    ? 'bg-slate-800 text-white scale-105'
                    : player.isEliminated
                    ? 'bg-slate-200 text-slate-400 opacity-50'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: player.color }}
                />
                <span className="font-bold truncate max-w-[60px]">{player.name}</span>
                <span className="text-xs opacity-75">{player.score}</span>
                <div className="flex">
                  {[...Array(DIFFICULTY_SETTINGS[gameState.difficulty].lives)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-3 h-3 ${
                        i < player.lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current player banner */}
        {currentPlayer && (
          <div
            className="mt-2 text-center py-1 px-3 rounded-full text-sm font-bold text-white mx-auto w-fit"
            style={{ backgroundColor: currentPlayer.color }}
          >
            {currentPlayer.name}'s beurt
            {getStreakText(currentPlayer.streakCount) && (
              <span className="ml-2 text-yellow-300">
                🔥 {getStreakText(currentPlayer.streakCount)}
              </span>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Top Panel: Current Card Area */}
        <section className="bg-slate-50 border-b lg:border-r border-slate-200 lg:w-1/3 p-4 sm:p-6 flex flex-col items-center justify-start lg:justify-center relative shrink-0 z-10 shadow-sm lg:shadow-none max-h-[45vh] lg:max-h-full overflow-y-auto">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 w-full text-center">
            Huidige Kaart
          </div>

          {gameState.currentCard && (
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm">
              <AudioPlayer
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                previewUrl={gameState.currentCard.spotifyPreviewUrl}
              />

              <div className="relative">
                <CardComponent
                  card={gameState.currentCard}
                  isRevealed={gameState.status === 'correct' || gameState.status === 'wrong'}
                  className="shadow-xl"
                />
              </div>

              {/* Wildcard message */}
              {gameState.status === 'playing' && gameState.currentCard.category === 'Wildcard' && (
                <div className="bg-purple-100 border border-purple-200 text-purple-700 px-3 py-2 rounded-lg flex items-center gap-2 animate-pulse text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="font-bold">Wildcard: Plaats waar je wilt!</span>
                </div>
              )}

              {/* Correct feedback */}
              {gameState.status === 'correct' && (
                <div className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg text-center relative overflow-visible">
                  {/* Floating score animation */}
                  {gameState.lastScoreEvents && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <ScorePopup
                        points={gameState.lastScoreEvents.reduce((sum, e) => sum + e.points, 0)}
                      />
                    </div>
                  )}

                  <div className="font-bold text-lg mb-1">Goed gedaan!</div>

                  {/* Streak fire effect */}
                  {currentPlayer && hasStreakBonus(currentPlayer.streakCount) && (
                    <div className="animate-streak-fire inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full mb-2 animate-pulse-glow">
                      <span className="text-lg">🔥</span>
                      <span className="font-bold">{currentPlayer.streakCount}x STREAK!</span>
                    </div>
                  )}

                  {gameState.lastScoreEvents && (
                    <div className="text-sm space-y-0.5">
                      {gameState.lastScoreEvents.map((event, i) => (
                        <div key={i} className="text-emerald-600">{event.message}</div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={nextTurn}
                    className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center gap-1 mx-auto"
                  >
                    Volgende <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Wrong feedback */}
              {gameState.status === 'wrong' && (
                <div className="bg-rose-100 text-rose-700 px-4 py-3 rounded-lg text-center">
                  <div className="font-bold text-lg mb-1">Fout!</div>
                  <p className="text-sm mb-3">{gameState.feedbackMessage}</p>
                  {currentPlayer && currentPlayer.lives <= 0 && (
                    <p className="text-rose-600 font-bold mb-2">Je bent uitgeschakeld!</p>
                  )}
                  <button
                    onClick={nextTurn}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 flex items-center gap-1 mx-auto"
                  >
                    Volgende <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right/Bottom Panel: Timeline */}
        <section className="flex-1 bg-slate-200/50 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-4xl mx-auto min-h-full">
            <h2 className="text-slate-500 font-bold mb-4 flex items-center gap-2 text-sm sm:text-base sticky top-0 bg-slate-200/95 p-2 rounded-lg z-0 backdrop-blur-sm lg:static lg:bg-transparent lg:p-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Tijdlijn ({gameState.timeline.length} kaarten)
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-20">
              {/* First placement button */}
              <PlacementButton
                onClick={() => handleTimelinePlacement(0)}
                disabled={gameState.status !== 'playing'}
                isFirst
              />

              {gameState.timeline.map((card, index) => (
                <React.Fragment key={card.id}>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1">
                      {card.year}
                    </div>
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

      {/* Inhoud Question Modal */}
      {gameState.currentCard && (
        <InhoudModal
          card={gameState.currentCard}
          isOpen={showInhoudModal}
          allCards={MOCK_DECK}
          onAnswer={handleInhoudAnswer}
          onSkip={handleInhoudSkip}
        />
      )}
    </div>
  );
}

// Improved Placement Button with larger touch targets
const PlacementButton = ({
  onClick,
  disabled,
  isFirst,
}: {
  onClick: () => void;
  disabled: boolean;
  isFirst?: boolean;
}) => {
  if (disabled) {
    return <div className="w-3 sm:w-4 h-1 bg-slate-300 rounded-full mx-1 opacity-30" />;
  }

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-center
        transition-all duration-200 ease-out
        ${isFirst ? 'mr-1' : 'mx-1'}
        touch-manipulation
        active:scale-95
      `}
    >
      <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-emerald-300 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 animate-pulse group-hover:scale-110 group-hover:shadow-emerald-500/50">
        <Plus className="w-6 h-6 sm:w-5 sm:h-5" />
      </div>
      {/* Tooltip - hidden on mobile */}
      <div className="hidden sm:block absolute -bottom-7 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap transition-opacity z-10">
        Plaats hier
      </div>
    </button>
  );
};
