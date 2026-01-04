import { SongCard } from '../types';

interface PlacementResult {
  isCorrect: boolean;
  message: string;
}

/**
 * Validate if a card can be placed at a specific position in the timeline
 * @param card - The card being placed
 * @param timeline - Current timeline of cards
 * @param insertIndex - Position to insert (0 = before first, timeline.length = after last)
 */
export function validatePlacement(
  card: SongCard,
  timeline: SongCard[],
  insertIndex: number
): PlacementResult {
  // Wildcard can be placed anywhere
  if (card.category === 'Wildcard') {
    return {
      isCorrect: true,
      message: 'Wildcard geplaatst!'
    };
  }

  // Handle Periode cards (year range)
  if (card.category === 'Periode' && card.yearRange) {
    return validatePeriodePlacement(card, timeline, insertIndex);
  }

  // Standard year-based validation for Basis, Herkenning, Inhoud
  return validateYearPlacement(card.year, timeline, insertIndex, card.title);
}

/**
 * Validate placement for a specific year
 */
function validateYearPlacement(
  year: number,
  timeline: SongCard[],
  insertIndex: number,
  cardTitle: string
): PlacementResult {
  // Empty timeline - any position is valid
  if (timeline.length === 0) {
    return { isCorrect: true, message: 'Goed gedaan!' };
  }

  // Inserting at the beginning
  if (insertIndex === 0) {
    const firstCard = timeline[0];
    if (year <= firstCard.year) {
      return { isCorrect: true, message: 'Goed gedaan!' };
    }
    return {
      isCorrect: false,
      message: `Fout! "${cardTitle}" (${year}) moet na "${firstCard.title}" (${firstCard.year}) komen.`
    };
  }

  // Inserting at the end
  if (insertIndex === timeline.length) {
    const lastCard = timeline[timeline.length - 1];
    if (year >= lastCard.year) {
      return { isCorrect: true, message: 'Goed gedaan!' };
    }
    return {
      isCorrect: false,
      message: `Fout! "${cardTitle}" (${year}) moet voor "${lastCard.title}" (${lastCard.year}) komen.`
    };
  }

  // Inserting in the middle
  const prevCard = timeline[insertIndex - 1];
  const nextCard = timeline[insertIndex];

  if (year >= prevCard.year && year <= nextCard.year) {
    return { isCorrect: true, message: 'Goed gedaan!' };
  }

  // Determine helpful error message
  if (year < prevCard.year) {
    return {
      isCorrect: false,
      message: `Fout! "${cardTitle}" (${year}) is ouder dan "${prevCard.title}" (${prevCard.year}).`
    };
  } else {
    return {
      isCorrect: false,
      message: `Fout! "${cardTitle}" (${year}) is nieuwer dan "${nextCard.title}" (${nextCard.year}).`
    };
  }
}

/**
 * Validate placement for Periode cards (year ranges)
 */
function validatePeriodePlacement(
  card: SongCard,
  timeline: SongCard[],
  insertIndex: number
): PlacementResult {
  const [rangeStart, rangeEnd] = card.yearRange!;

  // Empty timeline - any position is valid
  if (timeline.length === 0) {
    return { isCorrect: true, message: 'Goed gedaan!' };
  }

  // Check if the range can fit at this position
  // The range is valid if it overlaps with the valid year window at this position

  // Get the valid year window for this position
  let minYear = -Infinity;
  let maxYear = Infinity;

  if (insertIndex > 0) {
    minYear = timeline[insertIndex - 1].year;
  }
  if (insertIndex < timeline.length) {
    maxYear = timeline[insertIndex].year;
  }

  // Check if ranges overlap
  // Range [rangeStart, rangeEnd] overlaps with [minYear, maxYear]
  // if rangeStart <= maxYear AND rangeEnd >= minYear
  if (rangeStart <= maxYear && rangeEnd >= minYear) {
    return { isCorrect: true, message: 'Goed gedaan!' };
  }

  return {
    isCorrect: false,
    message: `Fout! De periode ${rangeStart}-${rangeEnd} past hier niet.`
  };
}

/**
 * Get the year to use for a card when inserting into timeline
 * For Periode cards, uses the middle of the range
 */
export function getCardYear(card: SongCard): number {
  if (card.category === 'Periode' && card.yearRange) {
    return Math.floor((card.yearRange[0] + card.yearRange[1]) / 2);
  }
  return card.year;
}
