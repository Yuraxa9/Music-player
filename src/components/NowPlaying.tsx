import React from 'react';
import { useMusic } from '../context/MusicContext';
import PlayerControls from './PlayerControls';

const NowPlaying: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    volume,
    resumeSong,
    pauseSong,
    previousSong,
    nextSong,
    seekToTime,
    setVolume
  } = useMusic();

  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-gray-800">
      <div className="flex items-center mb-4">
        {currentSong ? (
          <>
            <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg mr-4">
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">{currentSong.title}</h2>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
              {currentSong.album && (
                <p className="text-xs text-gray-500 mt-1">{currentSong.album}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <p className="text-gray-500">No song selected</p>
          </div>
        )}
      </div>
      <PlayerControls 
        song={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        onPlay={resumeSong}
        onPause={pauseSong}
        onPrevious={previousSong}
        onNext={nextSong}
        onSeek={seekToTime}
        onVolumeChange={setVolume}
      />
    </div>
  );
};

export default NowPlaying;