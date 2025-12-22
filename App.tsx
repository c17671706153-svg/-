import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { PhotoViewer } from './components/PhotoViewer';
import { GestureController } from './components/GestureController';
import { NoteViewer } from './components/NoteViewer';
import { MusicPlayer } from './components/MusicPlayer';
import { AlbumTitle } from './components/AlbumTitle';
import { AppState } from './types';
import { COLORS } from './constants';
import { PhotoProvider, usePhotos } from './contexts/PhotoContext';
import { MusicProvider, useMusic } from './contexts/MusicContext';

function Loader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black pointer-events-none transition-opacity duration-1000">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-light animate-pulse">
          资源加载中
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isElectron, setIsElectron] = useState(false);
  const { toggleMusic } = useMusic();
  const { highlightRandomPhoto } = usePhotos();

  useEffect(() => {
    // 检测是否在Electron环境中运行
    setIsElectron(typeof (window as any).electronAPI !== 'undefined');
  }, []);

  const handleStarClick = () => {
    setIsNoteOpen(true);
  };

  const handleStarMusicToggle = () => {
    toggleMusic();
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Electron环境指示器 */}
      {isElectron && (
        <div className="absolute top-4 left-4 z-50 bg-green-800 bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-mono">
          Desktop App
        </div>
      )}
      
      <AlbumTitle />
      <GestureController
        setAppState={setAppState}
        onPinch={highlightRandomPhoto}
      />
      <Overlay
        currentState={appState}
        onToggle={setAppState}
      />

      <Canvas
        dpr={[1, 2]} // Quality scaling
        shadows
        gl={{
          antialias: false,
          toneMapping: 3, // THREE.ReinhardToneMapping
          toneMappingExposure: 1.5
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 10, 50]} />

        <Suspense fallback={<Loader />}>
          <Experience appState={appState} onStarClick={handleStarClick} onStarMusicToggle={handleStarMusicToggle} />
        </Suspense>
      </Canvas>

      <PhotoViewer />
      <NoteViewer isOpen={isNoteOpen} onClose={() => setIsNoteOpen(false)} />
      <MusicPlayer />
    </div>
  );
}

function App() {
  return (
    <PhotoProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </PhotoProvider>
  );
}

export default App;