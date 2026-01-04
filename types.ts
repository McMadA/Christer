export type CardCategory = 'Basis' | 'Periode' | 'Herkenning' | 'Inhoud' | 'Wildcard';

export type Difficulty = 'Groen' | 'Geel' | 'Rood';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type GameStatus =
  | 'intro'
  | 'difficulty-select'
  | 'player-setup'
  | 'playing'
  | 'question-modal'  // For Inhoud cards
  | 'correct'
  | 'wrong'
  | 'gameover';

export interface SongCard {
  id: string;
  title: string;
  artist: string;
  year: number;
  category: CardCategory;
  difficulty: Difficulty;
  spotifyPreviewUrl?: string;
  question?: string; // For 'Inhoud' cards
  yearRange?: [number, number]; // For 'Periode' cards: [startYear, endYear]
}

export interface Player {
  id: string;
  name: string;
  color: string; // Hex color for player identification
  score: number;
  lives: number;
  streakCount: number; // For scoring bonuses
  isEliminated: boolean; // True when lives reach 0
}

export interface ScoreEvent {
  type: 'base' | 'streak' | 'difficulty' | 'category' | 'question_bonus';
  points: number;
  message: string;
}

export interface GameState {
  // Game flow
  status: GameStatus;
  difficulty: GameDifficulty;

  // Players (multiplayer support)
  players: Player[];
  currentPlayerIndex: number;

  // Cards
  currentCard: SongCard | null;
  deck: SongCard[];
  timeline: SongCard[]; // Shared timeline for all players

  // Feedback
  feedbackMessage?: string;
  lastScoreEvents?: ScoreEvent[]; // For showing score breakdown

  // Game end
  winner?: Player;
}

// Helper to get current player
export const getCurrentPlayer = (state: GameState): Player | null => {
  if (state.players.length === 0) return null;
  return state.players[state.currentPlayerIndex] || null;
};

// Default player colors
export const PLAYER_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
];

// Difficulty settings
export const DIFFICULTY_SETTINGS: Record<GameDifficulty, {
  lives: number;
  allowedCardDifficulties: Difficulty[];
  scoreMultiplier: number;
  label: string;
  description: string;
}> = {
  easy: {
    lives: 5,
    allowedCardDifficulties: ['Groen'],
    scoreMultiplier: 1,
    label: 'Makkelijk',
    description: 'Alleen groene kaarten, 5 levens'
  },
  medium: {
    lives: 3,
    allowedCardDifficulties: ['Groen', 'Geel'],
    scoreMultiplier: 1.5,
    label: 'Gemiddeld',
    description: 'Groene en gele kaarten, 3 levens'
  },
  hard: {
    lives: 2,
    allowedCardDifficulties: ['Groen', 'Geel', 'Rood'],
    scoreMultiplier: 2,
    label: 'Moeilijk',
    description: 'Alle kaarten, 2 levens'
  }
};

// Scoring constants
export const SCORING = {
  BASE_POINTS: 10,
  INHOUD_BONUS: 5,
  HERKENNING_BONUS: 2,
  STREAK_THRESHOLD_1: 3,  // 1.5x multiplier
  STREAK_THRESHOLD_2: 5,  // 2x multiplier
  STREAK_MULTIPLIER_1: 1.5,
  STREAK_MULTIPLIER_2: 2,
  CARD_DIFFICULTY_MULTIPLIERS: {
    'Groen': 1,
    'Geel': 1.25,
    'Rood': 1.5
  } as Record<Difficulty, number>
};
