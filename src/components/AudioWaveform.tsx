import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying }) => {
  const barsCount = 24;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll('.wave-bar');

    if (isPlaying) {
      bars.forEach((bar, i) => {
        const htmlBar = bar as HTMLElement;
        htmlBar.style.animation = `waveform 1.2s ease-in-out ${i * 0.05}s infinite`;
      });
    } else {
      bars.forEach((bar) => {
        const htmlBar = bar as HTMLElement;
        htmlBar.style.animation = 'none';
      });
    }
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef} 
      className="flex items-end justify-center gap-0.5 h-8 my-2 mx-auto w-full max-w-sm"
    >
      {[...Array(barsCount)].map((_, i) => (
        <div 
          key={i}
          className={`wave-bar w-1 bg-purple-400 rounded-sm transition-all duration-300 ${isPlaying ? '' : 'opacity-60'}`}
          style={{
            height: `${Math.floor(Math.random() * 60) + 10}%`,
            minHeight: '4px'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveform {
          0%, 100% {
            height: ${Math.floor(Math.random() * 30) + 10}%;
          }
          50% {
            height: ${Math.floor(Math.random() * 90) + 40}%;
          }
        }
      `}</style>
    </div>
  );
};

export default AudioWaveform;