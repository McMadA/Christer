export type CardCategory = 'Basis' | 'Periode' | 'Herkenning' | 'Inhoud' | 'Wildcard';

export type Difficulty = 'Groen' | 'Geel' | 'Rood';

export interface SongCard {
  id: string;
  title: string;
  artist: string;
  year: number;
  category: CardCategory;
  difficulty: Difficulty;
  spotifyPreviewUrl?: string; // Optional URL for preview
  question?: string; // For 'Inhoud' or 'Herkenning' specific questions
}

export interface GameState {
  timeline: SongCard[];
  currentCard: SongCard | null;
  deck: SongCard[];
  score: number;
  lives: number;
  status: 'intro' | 'playing' | 'correct' | 'wrong' | 'gameover';
  feedbackMessage?: string;
}
