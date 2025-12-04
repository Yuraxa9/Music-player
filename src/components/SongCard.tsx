import React from 'react';
import { Song } from '../types';
import { formatTime } from '../utils/formatters';
import { Play, Pause, Plus, Trash } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isPlaying?: boolean;
  isCurrentSong?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  onPlay: () => void;
  onPause?: () => void;
  onAddToPlaylist?: () => void;
  onRemoveFromPlaylist?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying = false,
  isCurrentSong = false,
  showAddButton = false,
  showRemoveButton = false,
  onPlay,
  onPause,
  onAddToPlaylist,
  onRemoveFromPlaylist
}) => {
  return (
    <div 
      data-testid="song-card"
      className={`flex items-center p-3 rounded-lg transition-all ${
        isCurrentSong 
          ? 'bg-purple-900/40 border-l-4 border-purple-500' 
          : 'hover:bg-white/5 border-l-4 border-transparent'
      }`}
    >
      <div className="flex-shrink-0 w-12 h-12 mr-4">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className={`text-sm font-medium truncate ${isCurrentSong ? 'text-white' : 'text-gray-200'}`}>
          {song.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
      
      <div className="flex items-center space-x-3 ml-2">
        <span className="text-xs text-gray-500">
          {formatTime(song.duration)}
        </span>
        
        {showAddButton && (
          <button 
            onClick={onAddToPlaylist}
            className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-full hover:bg-purple-600/30 transition"
            aria-label="Add to playlist"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
        
        {showRemoveButton && (
          <button 
            onClick={onRemoveFromPlaylist}
            className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-full hover:bg-red-600/30 transition"
            aria-label="Remove from playlist"
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        )}
        
        {isCurrentSong ? (
          <button 
            onClick={isPlaying ? onPause : onPlay}
            className={`p-1.5 rounded-full transition ${
              isPlaying 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white'
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        ) : (
          <button 
            onClick={onPlay}
            className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-full hover:bg-purple-600/30 transition"
            aria-label="Play"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;