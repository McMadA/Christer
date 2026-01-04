// Sound effects utility using Web Audio API
// No external audio files needed - generates tones programmatically

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

interface ToneOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  decay?: number;
}

function playTone(options: ToneOptions): void {
  const {
    frequency,
    duration,
    type = 'sine',
    volume = 0.3,
    attack = 0.01,
    decay = duration * 0.8
  } = options;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope: attack -> sustain -> decay
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.setValueAtTime(volume, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    // Silently fail if audio not available
    console.warn('Audio playback failed:', error);
  }
}

function playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine'): void {
  frequencies.forEach((freq, index) => {
    // Slight delay between notes for arpeggio effect
    setTimeout(() => {
      playTone({ frequency: freq, duration, type, volume: 0.2 });
    }, index * 50);
  });
}

// Sound effect functions
export const sounds = {
  /**
   * Play when card is placed correctly
   * Pleasant ascending chime
   */
  correct: (): void => {
    playTone({ frequency: 523.25, duration: 0.15, type: 'sine' }); // C5
    setTimeout(() => {
      playTone({ frequency: 659.25, duration: 0.15, type: 'sine' }); // E5
    }, 100);
    setTimeout(() => {
      playTone({ frequency: 783.99, duration: 0.25, type: 'sine' }); // G5
    }, 200);
  },

  /**
   * Play when card is placed incorrectly
   * Low buzzer sound
   */
  wrong: (): void => {
    playTone({ frequency: 200, duration: 0.3, type: 'sawtooth', volume: 0.2 });
    setTimeout(() => {
      playTone({ frequency: 180, duration: 0.2, type: 'sawtooth', volume: 0.15 });
    }, 150);
  },

  /**
   * Play when streak multiplier is achieved (3+ correct)
   * Celebratory fanfare
   */
  streak: (): void => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone({ frequency: freq, duration: 0.2, type: 'triangle', volume: 0.25 });
      }, i * 80);
    });
  },

  /**
   * Play when turn changes in multiplayer
   * Subtle notification bell
   */
  turn: (): void => {
    playTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.15 }); // A5
    setTimeout(() => {
      playTone({ frequency: 1108.73, duration: 0.15, type: 'sine', volume: 0.1 }); // C#6
    }, 80);
  },

  /**
   * Play at game over
   * Victory fanfare or game over sound based on win state
   */
  gameOver: (isWinner: boolean = true): void => {
    if (isWinner) {
      // Victory fanfare
      const melody = [
        { freq: 523.25, delay: 0 },     // C5
        { freq: 659.25, delay: 150 },   // E5
        { freq: 783.99, delay: 300 },   // G5
        { freq: 1046.50, delay: 450 },  // C6
        { freq: 783.99, delay: 600 },   // G5
        { freq: 1046.50, delay: 750 },  // C6
      ];
      melody.forEach(({ freq, delay }) => {
        setTimeout(() => {
          playTone({ frequency: freq, duration: 0.25, type: 'triangle', volume: 0.25 });
        }, delay);
      });
    } else {
      // Game over (lost) - descending sad tones
      const notes = [392, 349.23, 329.63, 293.66]; // G4, F4, E4, D4
      notes.forEach((freq, i) => {
        setTimeout(() => {
          playTone({ frequency: freq, duration: 0.3, type: 'sine', volume: 0.2 });
        }, i * 200);
      });
    }
  },

  /**
   * Play when life is lost
   * Heart break sound
   */
  lifeLost: (): void => {
    playTone({ frequency: 440, duration: 0.15, type: 'triangle', volume: 0.2 }); // A4
    setTimeout(() => {
      playTone({ frequency: 349.23, duration: 0.25, type: 'triangle', volume: 0.15 }); // F4
    }, 100);
  },

  /**
   * Play when Inhoud question is answered correctly
   * Quick success ding
   */
  questionCorrect: (): void => {
    playTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.2 }); // A5
    setTimeout(() => {
      playTone({ frequency: 1174.66, duration: 0.15, type: 'sine', volume: 0.2 }); // D6
    }, 80);
  },

  /**
   * Play when Inhoud question is answered wrong
   * Quick error sound
   */
  questionWrong: (): void => {
    playTone({ frequency: 311.13, duration: 0.2, type: 'square', volume: 0.1 }); // Eb4
  },

  /**
   * Play button click/tap feedback
   * Subtle click
   */
  click: (): void => {
    playTone({ frequency: 1000, duration: 0.05, type: 'sine', volume: 0.1 });
  },

  /**
   * Play when card is drawn
   * Card flip sound
   */
  cardDraw: (): void => {
    playTone({ frequency: 600, duration: 0.08, type: 'triangle', volume: 0.15 });
    setTimeout(() => {
      playTone({ frequency: 800, duration: 0.05, type: 'triangle', volume: 0.1 });
    }, 50);
  }
};

// Export individual sound functions for convenience
export const playCorrect = sounds.correct;
export const playWrong = sounds.wrong;
export const playStreak = sounds.streak;
export const playTurn = sounds.turn;
export const playGameOver = sounds.gameOver;
export const playLifeLost = sounds.lifeLost;
export const playQuestionCorrect = sounds.questionCorrect;
export const playQuestionWrong = sounds.questionWrong;
export const playClick = sounds.click;
export const playCardDraw = sounds.cardDraw;

// Utility to initialize audio context on first user interaction
export function initAudio(): void {
  getAudioContext();
}
