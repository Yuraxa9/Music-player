import React, { useState } from 'react';
import { MusicProvider } from './context/MusicContext';
import MusicLibrary from './components/MusicLibrary';
import PlaylistView from './components/PlaylistView';
import NowPlaying from './components/NowPlaying';
import { Music, ListMusic } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'playlists'>('library');
  
  return (
    <MusicProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
          <h1 className="text-xl font-semibold">Music Player</h1>
        </header>
        
        <div className="flex flex-col md:flex-row flex-1">
          {/* Main content */}
          <main className="flex-1 flex flex-col max-h-[calc(100vh-60px)]">
            {/* Tab navigation */}
            <nav className="flex border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center px-6 py-3 transition ${
                  activeTab === 'library'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Music className="w-4 h-4 mr-2" />
                Library
              </button>
              <button
                onClick={() => setActiveTab('playlists')}
                className={`flex items-center px-6 py-3 transition ${
                  activeTab === 'playlists' 
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ListMusic className="w-4 h-4 mr-2" />
                Playlists
              </button>
            </nav>
            
            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'library' && <MusicLibrary />}
              {activeTab === 'playlists' && <PlaylistView />}
            </div>
          </main>
          
          {/* Sidebar for Now Playing (visible on medium screens and up) */}
          <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-800">
            <NowPlaying />
          </aside>
        </div>
        
        {/* Animated background gradient (subtle animation) */}
        <div 
          className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950/30 via-gray-950 to-blue-950/20 opacity-50"
          style={{
            animation: 'gradient-shift 15s ease infinite alternate',
            backgroundSize: '200% 200%'
          }}
        />
        
        <style jsx>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
            }
          }
          
          /* Custom scrollbar for the library/playlist */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(107, 114, 128, 0.5);
            border-radius: 3px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background-color: transparent;
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease forwards;
          }
        `}</style>
      </div>
    </MusicProvider>
  );
};

export default App;