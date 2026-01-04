import React, { useEffect, useState } from 'react';

interface ScorePopupProps {
  points: number;
  message?: string;
  color?: 'emerald' | 'orange' | 'amber';
  onComplete?: () => void;
}

const ScorePopup: React.FC<ScorePopupProps> = ({
  points,
  message,
  color = 'emerald',
  onComplete
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const colorClasses = {
    emerald: 'text-emerald-600',
    orange: 'text-orange-500',
    amber: 'text-amber-500'
  };

  return (
    <div className={`animate-score-float font-black text-2xl ${colorClasses[color]} pointer-events-none select-none`}>
      +{points}
      {message && (
        <div className="text-sm font-bold opacity-80">{message}</div>
      )}
    </div>
  );
};

export default ScorePopup;
