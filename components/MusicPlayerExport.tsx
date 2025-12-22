import React, { useRef, useEffect, useState } from 'react';
import { useMusic } from '../contexts/MusicContext';

// Export version: Play/Pause, Volume, and Loop controls only (no upload)
export const MusicPlayerExport: React.FC = () => {
  const { currentMusic } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);
  // Use ref to track playing state for reliable access during music switching
  const isPlayingRef = useRef(false);
  // Track if this is the first load (for auto-play on initial load)
  const isFirstLoadRef = useRef(true);

  // Update audio/video source when music changes
  useEffect(() => {
    if (!currentMusic) {
      // Stop all media if no music
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Store previous playing state before switching (use ref for reliable state)
    const wasPlaying = isPlayingRef.current;
    
    // First, stop all currently playing media
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const isVideo = currentMusic.isVideo;
    
    if (isVideo) {
      // Use video element for video files
      if (!videoRef.current) return;
      const video = videoRef.current;
      
      if (currentMusic.source === 'file' && currentMusic.dataUrl) {
        video.src = currentMusic.dataUrl;
      } else if (currentMusic.source === 'url' && currentMusic.url) {
        video.src = currentMusic.url;
      }

      video.loop = isLooping;
      video.volume = volume;
      
      // Set up event listeners before loading
      const handleCanPlay = () => {
        if (isFirstLoadRef.current || wasPlaying) {
          video.play().then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            isFirstLoadRef.current = false;
          }).catch(() => {
            // Auto-play blocked, will retry on user interaction
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
        }
        video.removeEventListener('canplay', handleCanPlay);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.load();
      
      // Also try to play after a delay as fallback
      if (isFirstLoadRef.current || wasPlaying) {
        setTimeout(() => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            video.play().then(() => {
              setIsPlaying(true);
              isPlayingRef.current = true;
              isFirstLoadRef.current = false;
            }).catch(() => {
              // Auto-play blocked, will retry on user interaction
              setIsPlaying(false);
              isPlayingRef.current = false;
            });
          }
        }, 300);
      }
    } else {
      // Use audio element for audio files
      if (!audioRef.current) return;
      const audio = audioRef.current;
      
      if (currentMusic.source === 'file' && currentMusic.dataUrl) {
        audio.src = currentMusic.dataUrl;
      } else if (currentMusic.source === 'url' && currentMusic.url) {
        audio.src = currentMusic.url;
      }

      audio.loop = isLooping;
      audio.volume = volume;
      
      // Set up event listeners before loading
      const handleCanPlay = () => {
        if (isFirstLoadRef.current || wasPlaying) {
          audio.play().then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            isFirstLoadRef.current = false;
          }).catch(() => {
            // Auto-play blocked, will retry on user interaction
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
        }
        audio.removeEventListener('canplay', handleCanPlay);
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.load();
      
      // Also try to play after a delay as fallback
      if (isFirstLoadRef.current || wasPlaying) {
        setTimeout(() => {
          if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            audio.play().then(() => {
              setIsPlaying(true);
              isPlayingRef.current = true;
              isFirstLoadRef.current = false;
            }).catch(() => {
              // Auto-play blocked, will retry on user interaction
              setIsPlaying(false);
              isPlayingRef.current = false;
            });
          }
        }, 300);
      }
    }
  }, [currentMusic, volume, isLooping]);

  // Additional auto-play attempt on mount if music is available
  useEffect(() => {
    if (!currentMusic || !isFirstLoadRef.current) return;

    // Try to play after a short delay to ensure everything is ready
    const timer = setTimeout(() => {
      if (!isFirstLoadRef.current || isPlayingRef.current) return;

      const isVideo = currentMusic.isVideo;
      if (isVideo && videoRef.current && videoRef.current.readyState >= 2) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          isFirstLoadRef.current = false;
        }).catch(() => {
          // Auto-play blocked
        });
      } else if (!isVideo && audioRef.current && audioRef.current.readyState >= 2) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          isFirstLoadRef.current = false;
        }).catch(() => {
          // Auto-play blocked
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentMusic]);

  // Handle play/pause
  const togglePlay = () => {
    const isVideo = currentMusic?.isVideo;
    
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch(() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
      }
    } else if (!isVideo && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch(() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Handle loop toggle
  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
    if (videoRef.current) {
      videoRef.current.loop = !isLooping;
    }
  };

  // Try to auto-play on any user interaction if first load failed
  useEffect(() => {
    if (!currentMusic) return;

    const tryAutoPlay = () => {
      // Only try if not currently playing
      if (isPlayingRef.current) return;
      
      const isVideo = currentMusic.isVideo;
      if (isVideo && videoRef.current) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          isFirstLoadRef.current = false;
        }).catch(() => {
          // Still blocked
        });
      } else if (!isVideo && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          isFirstLoadRef.current = false;
        }).catch(() => {
          // Still blocked
        });
      }
    };

    // Listen for any user interaction (only if first load and not playing)
    if (isFirstLoadRef.current && !isPlayingRef.current) {
      document.addEventListener('click', tryAutoPlay, { once: true });
      document.addEventListener('touchstart', tryAutoPlay, { once: true });
      document.addEventListener('keydown', tryAutoPlay, { once: true });

      return () => {
        document.removeEventListener('click', tryAutoPlay);
        document.removeEventListener('touchstart', tryAutoPlay);
        document.removeEventListener('keydown', tryAutoPlay);
      };
    }
  }, [currentMusic]);

  // Sync playing state with audio/video element
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      isPlayingRef.current = true;
      isFirstLoadRef.current = false; // No longer first load once playing
    };
    const handlePause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };
    const handleEnded = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    if (audio) {
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
    }
    
    if (video) {
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      }
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentMusic]);

  if (!currentMusic) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[95vw]">
      <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 md:px-4 flex items-center gap-2 md:gap-4 shadow-2xl">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white flex-shrink-0"
          title={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-1 md:gap-2 min-w-[80px] md:min-w-[100px]">
          <span className="text-white/60 text-xs hidden sm:inline">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#B8860B]"
          />
          <span className="text-white/60 text-xs w-6 md:w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Loop Toggle */}
        <button
          onClick={toggleLoop}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${
            isLooping
              ? 'bg-[#B8860B]/30 text-[#FFD700]'
              : 'bg-white/10 hover:bg-white/20 text-white/60'
          }`}
          title={isLooping ? '循环' : '不循环'}
        >
          🔁
        </button>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          loop={isLooping}
          volume={volume}
          preload="auto"
        />
        {/* Hidden Video Element (for video files, audio only) */}
        <video
          ref={videoRef}
          loop={isLooping}
          volume={volume}
          preload="auto"
          playsInline
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
            top: '-9999px',
            left: '-9999px',
            visibility: 'hidden',
            display: 'none'
          }}
          muted={false}
        />
      </div>
    </div>
  );
};



