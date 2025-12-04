import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from './SongCard';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistModal from './CreatePlaylistModal';
import { PlusCircle } from 'lucide-react';
import { Playlist } from '../types';

const PlaylistView: React.FC = () => {
  const { 
    playlists, 
    currentPlaylist, 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    setCurrentPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeSongFromPlaylist
  } = useMusic();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const handleSavePlaylist = (name: string, description: string) => {
    if (editingPlaylist) {
      const updatedPlaylist = {
        ...editingPlaylist,
        name,
        description
      };
      updatePlaylist(updatedPlaylist);
    } else {
      createPlaylist(name, description);
    }
    setEditingPlaylist(null);
  };
  
  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setIsModalOpen(true);
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    setShowDeleteConfirm(playlistId);
  };
  
  const confirmDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId);
    setShowDeleteConfirm(null);
  };
  
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Your Playlists</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center py-1.5 px-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white text-sm transition"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              New Playlist
            </button>
          </div>
          
          {playlists.length > 0 ? (
            <div className="grid gap-3 grid-cols-1 mb-6">
              {playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  isActive={currentPlaylist?.id === playlist.id}
                  onSelect={() => setCurrentPlaylist(playlist)}
                  onEdit={() => handleEditPlaylist(playlist)}
                  onDelete={() => handleDeletePlaylist(playlist.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-gray-900/30 rounded-lg p-6 mb-6">
              <p className="text-gray-400 mb-3">No playlists yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition"
              >
                Create Your First Playlist
              </button>
            </div>
          )}
          
          {currentPlaylist && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">
                {currentPlaylist.name}
              </h3>
              {currentPlaylist.description && (
                <p className="text-sm text-gray-400 mb-4">
                  {currentPlaylist.description}
                </p>
              )}
              
              {currentPlaylist.songs.length > 0 ? (
                <div className="space-y-2">
                  {currentPlaylist.songs.map(song => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isCurrentSong={currentSong?.id === song.id}
                      isPlaying={currentSong?.id === song.id && isPlaying}
                      showRemoveButton
                      onPlay={() => playSong(song, currentPlaylist)}
                      onPause={() => pauseSong()}
                      onRemoveFromPlaylist={() => removeSongFromPlaylist(currentPlaylist.id, song.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-900/30 rounded-lg p-6">
                  <p className="text-gray-400">This playlist is empty</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlaylist(null);
        }}
        onSave={handleSavePlaylist}
        initialName={editingPlaylist?.name || ''}
        initialDescription={editingPlaylist?.description || ''}
        isEditing={!!editingPlaylist}
      />
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-2">Delete playlist?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this playlist? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeletePlaylist(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistView;