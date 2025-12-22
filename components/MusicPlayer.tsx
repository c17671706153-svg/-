import React, { useRef, useEffect, useState } from 'react';
import { useMusic } from '../contexts/MusicContext';

export const MusicPlayer: React.FC = () => {
  const { currentMusic } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);

  // Update audio/video source when music changes
  useEffect(() => {
    // First, stop all currently playing media
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (!currentMusic) {
      setIsPlaying(false);
      return;
    }

    const wasPlaying = isPlaying;
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
      
      video.load();
      video.volume = volume;
      video.loop = isLooping;
      
      // Always try to play when switching music
      video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      // Use audio element for audio files
      if (!audioRef.current) return;
      const audio = audioRef.current;
      
      if (currentMusic.source === 'file' && currentMusic.dataUrl) {
        audio.src = currentMusic.dataUrl;
      } else if (currentMusic.source === 'url' && currentMusic.url) {
        audio.src = currentMusic.url;
      }

      audio.load();
      audio.volume = volume;
      audio.loop = isLooping;
      
      // Always try to play when switching music
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentMusic, volume, isLooping]);

  // Handle play/pause
  const togglePlay = () => {
    const isVideo = currentMusic?.isVideo;
    
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Failed to play video:', error);
        alert('视频播放失败，请检查视频来源是否有效。');
        });
      }
    } else if (!isVideo && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
        alert('音频播放失败，请检查音频来源是否有效。');
        });
      }
    }
    setIsPlaying(!isPlaying);
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

  // Sync playing state with audio/video element
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          title={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Music Info */}
        <div className="min-w-[150px] max-w-[200px]">
          <p className="text-white text-sm truncate">{currentMusic.name}</p>
          <p className="text-white/60 text-xs">
            {currentMusic.source === 'file' ? '📁 文件' : '🔗 链接'}
          </p>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-white/60 text-xs">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#B8860B]"
          />
          <span className="text-white/60 text-xs w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Loop Toggle */}
        <button
          onClick={toggleLoop}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
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



