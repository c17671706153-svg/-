import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MusicData {
  id: string;
  name: string;
  source: 'file' | 'url';
  dataUrl?: string; // For uploaded files (Base64)
  url?: string; // For URL sources
  uploadedAt: number;
  isVideo?: boolean; // Whether the source is a video file
}

interface MusicContextType {
  currentMusic: MusicData | null;
  defaultMusic: MusicData | null;
  specialMusic: MusicData | null;
  setCurrentMusic: (music: MusicData | null) => void;
  setDefaultMusic: (music: MusicData | null) => void;
  setSpecialMusic: (music: MusicData | null) => void;
  addMusicFromFile: (file: File) => Promise<void>;
  addMusicFromUrl: (url: string, name: string) => void;
  removeMusic: () => void;
  toggleMusic: () => void; // Switch between default and special music
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const STORAGE_KEY = 'christmas-tree-music';
const DEFAULT_MUSIC_KEY = 'christmas-tree-default-music';
const SPECIAL_MUSIC_KEY = 'christmas-tree-special-music';

// Helper to convert file to base64
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface MusicProviderProps {
  children: ReactNode;
  initialMusic?: MusicData | null;
  initialDefaultMusic?: MusicData | null;
  initialSpecialMusic?: MusicData | null;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children, initialMusic, initialDefaultMusic, initialSpecialMusic }) => {
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(() => {
    // Use initialMusic if provided, otherwise null
    return initialMusic !== undefined ? initialMusic : null;
  });
  const [defaultMusic, setDefaultMusic] = useState<MusicData | null>(() => {
    return initialDefaultMusic !== undefined ? initialDefaultMusic : null;
  });
  const [specialMusic, setSpecialMusic] = useState<MusicData | null>(() => {
    return initialSpecialMusic !== undefined ? initialSpecialMusic : null;
  });

  // Load music from localStorage on mount (only if no initial music provided)
  useEffect(() => {
    if (initialMusic !== undefined && initialMusic !== null) {
      // Use initial music, don't load from localStorage
      setCurrentMusic(initialMusic);
      return;
    }
    if (initialDefaultMusic !== undefined || initialSpecialMusic !== undefined) {
      // Use initial music data, don't load from localStorage
      if (initialDefaultMusic) setDefaultMusic(initialDefaultMusic);
      if (initialSpecialMusic) setSpecialMusic(initialSpecialMusic);
      // Set current music to default if available
      if (initialDefaultMusic) setCurrentMusic(initialDefaultMusic);
      return;
    }
    try {
      // Load default music
      const storedDefault = localStorage.getItem(DEFAULT_MUSIC_KEY);
      if (storedDefault) {
        const parsed = JSON.parse(storedDefault);
        setDefaultMusic(parsed);
        setCurrentMusic(parsed); // Set default as current
      }
      // Load special music
      const storedSpecial = localStorage.getItem(SPECIAL_MUSIC_KEY);
      if (storedSpecial) {
        const parsed = JSON.parse(storedSpecial);
        setSpecialMusic(parsed);
      }
      // Fallback to old storage key for backward compatibility
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !storedDefault) {
        const parsed = JSON.parse(stored);
        setDefaultMusic(parsed);
        setCurrentMusic(parsed);
      }
    } catch (error) {
      console.error('Failed to load music from storage:', error);
    }
  }, [initialMusic, initialDefaultMusic, initialSpecialMusic]);

  // Save music to localStorage whenever it changes (only if not using initial music)
  useEffect(() => {
    if (initialMusic !== undefined && initialMusic !== null) {
      // Don't save to localStorage if using initial music (export mode)
      return;
    }
    if (initialDefaultMusic !== undefined || initialSpecialMusic !== undefined) {
      // Don't save to localStorage if using initial music (export mode)
      return;
    }
    try {
      if (defaultMusic) {
        localStorage.setItem(DEFAULT_MUSIC_KEY, JSON.stringify(defaultMusic));
      } else {
        localStorage.removeItem(DEFAULT_MUSIC_KEY);
      }
      if (specialMusic) {
        localStorage.setItem(SPECIAL_MUSIC_KEY, JSON.stringify(specialMusic));
      } else {
        localStorage.removeItem(SPECIAL_MUSIC_KEY);
      }
    } catch (error) {
      console.error('Failed to save music to storage:', error);
    }
  }, [defaultMusic, specialMusic, initialMusic, initialDefaultMusic, initialSpecialMusic]);

  const addMusicFromFile = async (file: File, isSpecial: boolean = false) => {
    // Validate file type - support both audio and video files
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    const validAudioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const validVideoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    const fileName = file.name.toLowerCase();
    
    const isAudio = validAudioTypes.includes(file.type) || 
                    validAudioExtensions.some(ext => fileName.endsWith(ext));
    const isVideo = validVideoTypes.includes(file.type) || 
                    validVideoExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isAudio && !isVideo) {
      alert('Please upload a valid audio or video file (MP3, WAV, OGG, M4A, AAC, MP4, WEBM, MOV, AVI).');
      return;
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Audio file is too large. Maximum size is 50MB.');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const music: MusicData = {
        id: Date.now().toString(),
        name: file.name,
        source: 'file',
        dataUrl,
        uploadedAt: Date.now(),
        isVideo: isVideo, // Mark if it's a video file
      };
      if (isSpecial) {
        setSpecialMusic(music);
      } else {
        setDefaultMusic(music);
        setCurrentMusic(music); // Set as current if it's default
      }
    } catch (error) {
      console.error('Failed to process file:', error);
      alert('Failed to process file. Please try again.');
    }
  };

  const addMusicFromUrl = (url: string, name: string, isSpecial: boolean = false) => {
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL.');
      return;
    }

    const music: MusicData = {
      id: Date.now().toString(),
      name: name || 'Music from URL',
      source: 'url',
      url,
      uploadedAt: Date.now(),
    };
    if (isSpecial) {
      setSpecialMusic(music);
    } else {
      setDefaultMusic(music);
      setCurrentMusic(music); // Set as current if it's default
    }
  };

  const toggleMusic = () => {
    // Switch between default and special music
    // When switching, we want to play the new music automatically
    if (currentMusic === defaultMusic && specialMusic) {
      // Switch to special music
      setCurrentMusic(specialMusic);
    } else if (currentMusic === specialMusic && defaultMusic) {
      // Switch back to default music
      setCurrentMusic(defaultMusic);
    } else if (!currentMusic && defaultMusic) {
      // No music playing, start with default
      setCurrentMusic(defaultMusic);
    } else if (!currentMusic && specialMusic) {
      // No music playing, start with special
      setCurrentMusic(specialMusic);
    }
    // Note: The MusicPlayer component will handle auto-playing when currentMusic changes
  };

  const removeMusic = (isSpecial: boolean = false) => {
    if (isSpecial) {
      if (window.confirm('Are you sure you want to remove the special music?')) {
        setSpecialMusic(null);
        if (currentMusic === specialMusic) {
          setCurrentMusic(defaultMusic);
        }
      }
    } else {
      if (window.confirm('Are you sure you want to remove the default music?')) {
        setDefaultMusic(null);
        if (currentMusic === defaultMusic) {
          setCurrentMusic(specialMusic || null);
        }
      }
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentMusic,
        defaultMusic,
        specialMusic,
        setCurrentMusic,
        setDefaultMusic,
        setSpecialMusic,
        addMusicFromFile,
        addMusicFromUrl,
        removeMusic,
        toggleMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

