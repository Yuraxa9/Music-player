import React from 'react';
import { Playlist } from '../types';
import { Music, Play, Edit, Trash } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isActive,
  onSelect,
  onEdit,
  onDelete
}) => {
  const { name, description, songs } = playlist;

  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-purple-900/50 border-l-4 border-purple-500' 
          : 'hover:bg-white/5 border-l-4 border-transparent'
      }`}
    >
      <div className="flex">
        <div 
          className={`flex items-center justify-center w-14 h-14 rounded-lg mr-4 ${
            isActive ? 'bg-purple-600/50' : 'bg-gray-800'
          }`}
        >
          <Music className="w-6 h-6 text-gray-300" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${isActive ? 'text-white' : 'text-gray-200'}`}>
                {name}
              </h3>
              {description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                data-testid="edit-playlist"
                className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-full hover:bg-purple-600/30 transition"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-full hover:bg-red-600/30 transition"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <button 
            onClick={onSelect}
            className={`flex items-center mt-2 py-1.5 px-3 rounded-full text-xs transition ${
              isActive 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Play className="w-3 h-3 mr-1" />
            {isActive ? 'Now Playing' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;