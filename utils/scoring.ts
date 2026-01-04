import { SongCard, GameDifficulty, ScoreEvent, SCORING, DIFFICULTY_SETTINGS } from '../types';

interface ScoreCalculationResult {
  totalPoints: number;
  events: ScoreEvent[];
}

/**
 * Calculate score for a correct card placement
 */
export function calculateScore(
  card: SongCard,
  streakCount: number,
  difficulty: GameDifficulty,
  answeredQuestion: boolean = false
): ScoreCalculationResult {
  const events: ScoreEvent[] = [];
  let totalPoints = 0;

  // 1. Base points
  const basePoints = SCORING.BASE_POINTS;
  events.push({
    type: 'base',
    points: basePoints,
    message: `+${basePoints} punten`
  });
  totalPoints += basePoints;

  // 2. Question bonus (for Inhoud cards)
  if (card.category === 'Inhoud' && answeredQuestion) {
    events.push({
      type: 'question_bonus',
      points: SCORING.INHOUD_BONUS,
      message: `+${SCORING.INHOUD_BONUS} vraag bonus`
    });
    totalPoints += SCORING.INHOUD_BONUS;
  }

  // 3. Herkenning bonus (for correctly placed recognition cards)
  if (card.category === 'Herkenning') {
    events.push({
      type: 'category',
      points: SCORING.HERKENNING_BONUS,
      message: `+${SCORING.HERKENNING_BONUS} herkenning bonus`
    });
    totalPoints += SCORING.HERKENNING_BONUS;
  }

  // 4. Card difficulty multiplier
  const cardMultiplier = SCORING.CARD_DIFFICULTY_MULTIPLIERS[card.difficulty];
  if (cardMultiplier > 1) {
    const bonusPoints = Math.round(totalPoints * (cardMultiplier - 1));
    events.push({
      type: 'category',
      points: bonusPoints,
      message: `+${bonusPoints} ${card.difficulty.toLowerCase()} kaart`
    });
    totalPoints += bonusPoints;
  }

  // 5. Streak multiplier
  let streakMultiplier = 1;
  if (streakCount >= SCORING.STREAK_THRESHOLD_2) {
    streakMultiplier = SCORING.STREAK_MULTIPLIER_2;
  } else if (streakCount >= SCORING.STREAK_THRESHOLD_1) {
    streakMultiplier = SCORING.STREAK_MULTIPLIER_1;
  }

  if (streakMultiplier > 1) {
    const beforeStreak = totalPoints;
    totalPoints = Math.round(totalPoints * streakMultiplier);
    const streakBonus = totalPoints - beforeStreak;
    events.push({
      type: 'streak',
      points: streakBonus,
      message: `x${streakMultiplier} streak! (+${streakBonus})`
    });
  }

  // 6. Difficulty multiplier
  const difficultyMultiplier = DIFFICULTY_SETTINGS[difficulty].scoreMultiplier;
  if (difficultyMultiplier > 1) {
    const beforeDifficulty = totalPoints;
    totalPoints = Math.round(totalPoints * difficultyMultiplier);
    const difficultyBonus = totalPoints - beforeDifficulty;
    events.push({
      type: 'difficulty',
      points: difficultyBonus,
      message: `+${difficultyBonus} ${DIFFICULTY_SETTINGS[difficulty].label.toLowerCase()} modus`
    });
  }

  return { totalPoints, events };
}

/**
 * Get streak multiplier text for display
 */
export function getStreakText(streakCount: number): string | null {
  if (streakCount >= SCORING.STREAK_THRESHOLD_2) {
    return `${streakCount}x STREAK! (2x punten)`;
  } else if (streakCount >= SCORING.STREAK_THRESHOLD_1) {
    return `${streakCount}x streak (1.5x punten)`;
  }
  return null;
}

/**
 * Check if current streak qualifies for a multiplier
 */
export function hasStreakBonus(streakCount: number): boolean {
  return streakCount >= SCORING.STREAK_THRESHOLD_1;
}
