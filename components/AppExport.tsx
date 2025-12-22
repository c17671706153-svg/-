import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ExperienceExport } from './ExperienceExport';
import { OverlayExport } from './OverlayExport';
import { PhotoViewer } from './PhotoViewer';
import { NoteViewer } from './NoteViewer';
import { MusicPlayerExport } from './MusicPlayerExport';
import { AlbumTitle } from './AlbumTitle';
import { AppState } from '../types';
import { COLORS } from '../constants';
import { PhotoProvider } from '../contexts/PhotoContext';
import { MusicProvider, useMusic } from '../contexts/MusicContext';

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

function AppExportContent() {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const { toggleMusic } = useMusic();

  const handleStarClick = () => {
    setIsNoteOpen(true);
  };

  const handleStarMusicToggle = () => {
    toggleMusic();
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <AlbumTitle />
      <OverlayExport 
        currentState={appState} 
        onToggle={setAppState} 
      />
      
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ 
          antialias: false,
          toneMapping: 3,
          toneMappingExposure: 1.5 
        }} 
      >
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 10, 50]} />
        
        <Suspense fallback={<Loader />}>
          <ExperienceExport appState={appState} onStarClick={handleStarClick} onStarMusicToggle={handleStarMusicToggle} />
        </Suspense>
      </Canvas>

      <PhotoViewer />
      <NoteViewer isOpen={isNoteOpen} onClose={() => setIsNoteOpen(false)} />
      <MusicPlayerExport />
    </div>
  );
}

function AppExport() {
  // Load embedded photos and music from window (data is loaded in <script> tag before React)
  const embeddedPhotos = (window as any).EMBEDDED_PHOTOS || [];
  const embeddedMusicData = (window as any).EMBEDDED_MUSIC || null;

  // Handle both old format (single music object) and new format (object with default/special)
  let initialDefaultMusic = null;
  let initialSpecialMusic = null;
  
  if (embeddedMusicData) {
    // Check if it's the new format (object with default/special keys)
    if (embeddedMusicData.default !== undefined || embeddedMusicData.special !== undefined) {
      initialDefaultMusic = embeddedMusicData.default || null;
      initialSpecialMusic = embeddedMusicData.special || null;
    } else {
      // Old format: single music object, treat as default music
      initialDefaultMusic = embeddedMusicData;
    }
  }

  // Debug: log to console
  useEffect(() => {
    console.log('AppExport - Embedded Photos:', embeddedPhotos.length);
    console.log('AppExport - Default Music:', initialDefaultMusic ? initialDefaultMusic.name : 'null');
    console.log('AppExport - Special Music:', initialSpecialMusic ? initialSpecialMusic.name : 'null');
  }, []);

  return (
    <PhotoProvider initialPhotos={embeddedPhotos.length > 0 ? embeddedPhotos : undefined}>
      <MusicProvider 
        initialDefaultMusic={initialDefaultMusic || undefined}
        initialSpecialMusic={initialSpecialMusic || undefined}
      >
        <AppExportContent />
      </MusicProvider>
    </PhotoProvider>
  );
}

export default AppExport;

