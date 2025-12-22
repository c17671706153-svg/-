import React, { useState } from 'react';
import { AppState } from '../types';
import { PhotoManager } from './PhotoManager';
import { MusicManager } from './MusicManager';
import { usePhotos } from '../contexts/PhotoContext';
import { useMusic } from '../contexts/MusicContext';
import { exportToHtml } from '../utils/exportHtml';

// Import reference icons
import refTree from './ref_tree.png';
import refBell from './ref_bell.png';
import refGift from './ref_gift.png';
import refSnowflake from './ref_snowflake.png';
import refCandy from './ref_candy.png';

interface OverlayProps {
  currentState: AppState;
  onToggle: (state: AppState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ currentState, onToggle }) => {
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [isMusicManagerOpen, setIsMusicManagerOpen] = useState(false);
  const { photos } = usePhotos();
  const { defaultMusic, specialMusic } = useMusic();

  const handleExport = () => {
    exportToHtml(photos, defaultMusic, specialMusic);
  };

  const navButtonClass = "transition-all duration-300 ease-out hover:scale-110 active:scale-95 flex items-center justify-center w-12 h-12 p-0 rounded-full flex-none overflow-hidden";

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-8 md:p-12">
        {/* Controls Container */}
        <div className="flex flex-col items-center gap-6 pointer-events-auto mb-8 w-full">
          {/* Glassmorphism Dark Card - Compact Single Row */}
          <div className="flex flex-row gap-4 items-center justify-center backdrop-blur-xl bg-black/60 px-6 py-3 rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">

            {/* Tree Mode */}
            <button
              onClick={() => onToggle(AppState.TREE_SHAPE)}
              className={`${navButtonClass} ${currentState === AppState.TREE_SHAPE ? 'brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''}`}
              title="树形模式"
            >
              <img src={refTree} alt="Tree Mode" className="w-full h-full object-cover block scale-125" />
            </button>

            {/* Scattered Mode (Snowflake) */}
            <button
              onClick={() => onToggle(AppState.SCATTERED)}
              className={`${navButtonClass} ${currentState === AppState.SCATTERED ? 'brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''}`}
              title="散落模式"
            >
              <img src={refSnowflake} alt="Scattered Mode" className="w-full h-full object-cover block scale-125" />
            </button>

            {/* Music Manager (Bell) */}
            <button
              onClick={() => setIsMusicManagerOpen(true)}
              className={navButtonClass}
              title="音乐管理"
            >
              <img src={refBell} alt="Music Manager" className="w-full h-full object-cover block scale-125" />
            </button>

            {/* Photo Manager (Candy) */}
            <button
              onClick={() => setIsPhotoManagerOpen(true)}
              className={navButtonClass}
              title="照片管理"
            >
              <img src={refCandy} alt="Photo Manager" className="w-full h-full object-cover block scale-125" />
            </button>

            {/* Export (Gift) */}
            <button
              onClick={handleExport}
              className={navButtonClass}
              title="导出 HTML"
            >
              <img src={refGift} alt="Export" className="w-full h-full object-cover block scale-125" />
            </button>

          </div>
        </div>
      </div>

      <PhotoManager
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
      />
      <MusicManager
        isOpen={isMusicManagerOpen}
        onClose={() => setIsMusicManagerOpen(false)}
      />
    </>
  );
};