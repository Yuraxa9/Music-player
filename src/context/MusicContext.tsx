import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Song, Playlist } from '../types';
import { sampleSongs } from '../data/sampleSongs';
import { generateId } from '../utils/formatters';

interface MusicContextProps {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  currentPlaylist: Playlist | null;
  
  // Actions
  playSong: (song: Song, playlist?: Playlist) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekToTime: (time: number) => void;
  setVolume: (volume: number) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [songs] = useState<Song[]>(sampleSongs);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  
  // Load playlists from localStorage on initial render
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('musicPlayerPlaylists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      // Create a default playlist if none exists
      const defaultPlaylist: Playlist = {
        id: generateId(),
        name: 'Favorites',
        description: 'My favorite songs',
        songs: [sampleSongs[0], sampleSongs[1]],
        createdAt: Date.now()
      };
      setPlaylists([defaultPlaylist]);
    }
  }, []);
  
  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('musicPlayerPlaylists', JSON.stringify(playlists));
    }
  }, [playlists]);
  
  // Initialize audio element
  useEffect(() => {
    const newAudio = new Audio();
    newAudio.volume = volume;
    
    const updateTime = () => {
      setCurrentTime(newAudio.currentTime);
    };
    
    const handleEnded = () => {
      nextSong();
    };
    
    newAudio.addEventListener('timeupdate', updateTime);
    newAudio.addEventListener('ended', handleEnded);
    
    setAudio(newAudio);
    
    return () => {
      newAudio.pause();
      newAudio.removeEventListener('timeupdate', updateTime);
      newAudio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Play a song
  const playSong = (song: Song, playlist?: Playlist) => {
    if (audio) {
      if (currentSong?.id === song.id) {
        resumeSong();
        return;
      }
      
      audio.src = song.audioUrl;
      audio.currentTime = 0;
      setCurrentSong(song);
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
      
      if (playlist) {
        setCurrentPlaylist(playlist);
      }
    }
  };
  
  // Pause the current song
  const pauseSong = () => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };
  
  // Resume the current song
  const resumeSong = () => {
    if (audio && currentSong && !isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error resuming audio:', error);
      });
    }
  };
  
  // Play the next song in the playlist
  const nextSong = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
      if (currentIndex !== -1 && currentIndex < currentPlaylist.songs.length - 1) {
        playSong(currentPlaylist.songs[currentIndex + 1], currentPlaylist);
      } else if (currentPlaylist.songs.length > 0) {
        // Loop back to the first song
        playSong(currentPlaylist.songs[0], currentPlaylist);
      }
    } else if (currentSong) {
      // If no playlist, cycle through all songs
      const currentIndex = songs.findIndex(s => s.id === currentSong.id);
      if (currentIndex !== -1 && currentIndex < songs.length - 1) {
        playSong(songs[currentIndex + 1]);
      } else if (songs.length > 0) {
        playSong(songs[0]);
      }
    }
  };
  
  // Play the previous song in the playlist
  const previousSong = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
      if (currentIndex > 0) {
        playSong(currentPlaylist.songs[currentIndex - 1], currentPlaylist);
      } else if (currentPlaylist.songs.length > 0) {
        // Loop to the last song
        playSong(currentPlaylist.songs[currentPlaylist.songs.length - 1], currentPlaylist);
      }
    } else if (currentSong) {
      // If no playlist, cycle through all songs
      const currentIndex = songs.findIndex(s => s.id === currentSong.id);
      if (currentIndex > 0) {
        playSong(songs[currentIndex - 1]);
      } else if (songs.length > 0) {
        playSong(songs[songs.length - 1]);
      }
    }
  };
  
  // Seek to a specific time in the song
  const seekToTime = (time: number) => {
    if (audio && currentSong) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Set the volume
  const setVolume = (newVolume: number) => {
    if (audio) {
      audio.volume = newVolume;
      setVolumeState(newVolume);
    }
  };
  
  // Create a new playlist
  const createPlaylist = (name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: generateId(),
      name,
      description,
      songs: [],
      createdAt: Date.now()
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };
  
  // Update an existing playlist
  const updatePlaylist = (updatedPlaylist: Playlist) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
      )
    );
    
    // Update current playlist if it's the one being updated
    if (currentPlaylist?.id === updatedPlaylist.id) {
      setCurrentPlaylist(updatedPlaylist);
    }
  };
  
  // Delete a playlist
  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    
    // Clear current playlist if it's the one being deleted
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }
  };
  
  // Add a song to a playlist
  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => 
      prev.map(playlist => {
        if (playlist.id === playlistId) {
          // Check if song is already in playlist
          if (!playlist.songs.some(s => s.id === song.id)) {
            return {
              ...playlist,
              songs: [...playlist.songs, song]
            };
          }
        }
        return playlist;
      })
    );
  };
  
  // Remove a song from a playlist
  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => 
      prev.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.filter(song => song.id !== songId)
          };
        }
        return playlist;
      })
    );
    
    // If the removed song is currently playing and from the current playlist,
    // play the next song
    if (currentSong?.id === songId && currentPlaylist?.id === playlistId) {
      nextSong();
    }
  };
  
  return (
    <MusicContext.Provider value={{
      songs,
      playlists,
      currentSong,
      isPlaying,
      currentTime,
      volume,
      currentPlaylist,
      playSong,
      pauseSong,
      resumeSong,
      nextSong,
      previousSong,
      seekToTime,
      setVolume,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      setCurrentPlaylist
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextProps => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};