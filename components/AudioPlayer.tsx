import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  previewUrl?: string; // Optional real URL
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onTogglePlay, previewUrl }) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (previewUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(previewUrl);
        audioRef.current.volume = 0.5;
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = previewUrl;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isPlaying) {
      // Simulate progress if no real audio, or track real audio
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
      }
      
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 150); // 15s loop roughly
      return () => clearInterval(interval);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="w-full max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-slate-700">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-green-500 shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>
        <Disc className="w-6 h-6 text-black" />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-green-400">Spotify Preview</span>
          <span className="text-[10px] text-slate-400">00:{Math.floor(progress / 100 * 30).toString().padStart(2, '0')}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button 
        onClick={onTogglePlay}
        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
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
