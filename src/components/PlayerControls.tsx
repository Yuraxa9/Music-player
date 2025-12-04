import React from 'react';
import { formatTime } from '../utils/formatters';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import AudioWaveform from './AudioWaveform';
import { Song } from '../types';

interface PlayerControlsProps {
  song: Song | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  song, 
  isPlaying,
  currentTime,
  volume,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange
}) => {
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (song) {
      onSeek(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 0.7);
  };

  return (
    <div 
      className="player-controls w-full py-4 px-6 backdrop-blur-md bg-black/30 rounded-xl"
      data-testid="player-controls"
    >
      {song ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-300">
              {formatTime(currentTime)}
            </div>
            <div className="relative w-full mx-4">
              <input
                type="range"
                min="0"
                max={song.duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                data-testid="progress-bar"
              />
            </div>
            <div className="text-xs text-gray-300">
              {formatTime(song.duration)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <AudioWaveform isPlaying={isPlaying} />
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleMute}
                className="p-1 text-gray-300 hover:text-white transition"
                data-testid="mute-button"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <div className="w-20">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  data-testid="volume-slider"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-8 mt-4">
            <button 
              onClick={onPrevious}
              className="p-2 text-gray-300 hover:text-white transition"
              data-testid="prev-button"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={isPlaying ? onPause : onPlay}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition transform hover:scale-105"
              data-testid="play-pause-button"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button 
              onClick={onNext}
              className="p-2 text-gray-300 hover:text-white transition"
              data-testid="next-button"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-24 text-gray-500" data-testid="no-song">
          No song selected
        </div>
      )}
    </div>
  );
};

export default PlayerControls;