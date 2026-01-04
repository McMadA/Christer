import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Disc, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  previewUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onTogglePlay, previewUrl }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30); // Default 30s for previews
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Create and configure audio element when previewUrl changes
  useEffect(() => {
    // Clean up previous audio element completely
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }

    // Reset state for new audio
    setProgress(0);
    setCurrentTime(0);
    setHasError(false);

    if (!previewUrl) return;

    setIsLoading(true);
    const audio = new Audio(previewUrl);
    audio.volume = 0.5;
    audio.loop = true;
    audio.preload = 'auto';

    // Event handlers
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
      setIsLoading(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      console.warn('Audio failed to load:', previewUrl);
    };

    const handleEnded = () => {
      // Reset progress when audio ends (for non-looping scenarios)
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, [previewUrl]);

  // Update progress based on actual audio time
  const updateProgress = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      const time = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 30;
      setCurrentTime(time);
      setProgress((time / dur) * 100);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play()
        .then(() => {
          // Start progress tracking
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        })
        .catch(e => {
          console.warn('Audio play failed (interaction needed):', e);
          setHasError(true);
        });
    } else {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, updateProgress]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[90vw] sm:max-w-sm bg-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 sm:gap-4 border border-slate-700">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-green-500 shadow-lg shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
        {hasError ? (
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        ) : (
          <Disc className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] sm:text-xs font-bold text-green-400 uppercase tracking-wider">
            {isLoading ? 'Laden...' : hasError ? 'Audio fout' : 'Audio Preview'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onTogglePlay}
        disabled={hasError || isLoading}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
          hasError || isLoading
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-slate-200'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
        )}
      </button>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
