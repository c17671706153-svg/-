import React from 'react';
import { AppState } from '../types';

interface OverlayExportProps {
  currentState: AppState;
  onToggle: (state: AppState) => void;
}

// Export version: No Photo button, no Music button
export const OverlayExport: React.FC<OverlayExportProps> = ({ currentState, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-end p-4 md:p-8 lg:p-12">
      {/* Controls */}
      <div className="flex flex-col items-center gap-3 md:gap-6 pointer-events-auto mb-20 md:mb-8 w-full">
        <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center backdrop-blur-sm bg-black/40 p-2 md:p-1 rounded-full border border-white/20 md:border-white/10">
            <button
              onClick={() => onToggle(AppState.SCATTERED)}
              className={`transition-all duration-700 ease-out px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-sm tracking-[0.2em] uppercase border font-medium ${
                currentState === AppState.SCATTERED
                  ? 'bg-[#B8860B] text-black border-[#FFD700] shadow-[0_0_30px_rgba(184,134,11,0.6)]'
                  : 'bg-transparent text-[#B8860B] border-[#B8860B]/50 hover:border-[#B8860B] hover:text-[#FFD700]'
              }`}
            >
              散落
            </button>
            
            <button
              onClick={() => onToggle(AppState.TREE_SHAPE)}
              className={`transition-all duration-700 ease-out px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-sm tracking-[0.2em] uppercase border font-medium ${
                currentState === AppState.TREE_SHAPE
                  ? 'bg-[#044f1e] text-white border-[#18a84a] shadow-[0_0_30px_rgba(4,79,30,0.8)]'
                  : 'bg-transparent text-[#18a84a] border-[#18a84a]/50 hover:border-[#18a84a] hover:text-white'
              }`}
            >
              树形
            </button>
        </div>
      </div>
    </div>
  );
};



