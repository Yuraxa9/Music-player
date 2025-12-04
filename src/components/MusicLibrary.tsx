import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from './SongCard';
import { Search, Plus } from 'lucide-react';

const MusicLibrary: React.FC = () => {
  const { 
    songs, 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    playlists, 
    addSongToPlaylist 
  } = useMusic();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for songs, artists or albums"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-4">
        <h2 className="text-lg font-medium text-white mb-4">Music Library</h2>
        {filteredSongs.length > 0 ? (
          <div className="space-y-2">
            {filteredSongs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                isCurrentSong={currentSong?.id === song.id}
                isPlaying={currentSong?.id === song.id && isPlaying}
                showAddButton={playlists.length > 0}
                onPlay={() => playSong(song)}
                onPause={() => pauseSong()}
                onAddToPlaylist={() => {
                  if (playlists.length === 1) {
                    addSongToPlaylist(playlists[0].id, song);
                  } else {
                    setSelectedPlaylistId(song.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p>No songs found</p>
          </div>
        )}
      </div>

      {/* Playlist selection dropdown */}
      {selectedPlaylistId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setSelectedPlaylistId(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 w-80" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium mb-3">Add to playlist</h3>
            <div className="max-h-60 overflow-y-auto">
              {playlists.map(playlist => {
                const song = songs.find(s => s.id === selectedPlaylistId);
                const alreadyInPlaylist = song && playlist.songs.some(s => s.id === song.id);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => {
                      if (song && !alreadyInPlaylist) {
                        addSongToPlaylist(playlist.id, song);
                        setSelectedPlaylistId(null);
                      }
                    }}
                    disabled={alreadyInPlaylist}
                    className={`flex items-center w-full p-2 rounded-lg text-left mb-1 ${
                      alreadyInPlaylist
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        : 'hover:bg-gray-800 text-white'
                    }`}
                  >
                    <Plus className={`w-4 h-4 mr-2 ${alreadyInPlaylist ? 'text-gray-600' : 'text-purple-500'}`} />
                    <span className="truncate">{playlist.name}</span>
                    {alreadyInPlaylist && (
                      <span className="text-xs ml-auto text-gray-500">Already added</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedPlaylistId(null)}
              className="w-full mt-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;