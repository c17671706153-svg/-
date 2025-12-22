import React, { useEffect } from 'react';

interface NoteViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Sticky Note */}
      <div
        className="relative bg-[#FFEB3B] shadow-2xl transform transition-all duration-300"
        style={{
          width: '90%',
          maxWidth: '500px',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
          fontFamily: "'Dancing Script', cursive",
          transform: 'rotate(-2deg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-gray-700 text-xl transition-all z-10"
        >
          ×
        </button>

        {/* Christmas decorative ribbons around the edges - thin greeting card style */}
        {/* Top ribbon */}
        <div className="absolute top-0 left-0 right-0 h-0.5 flex">
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-[#FFD700]"></div>
          <div className="flex-1 bg-[#C0C0C0]"></div>
        </div>
        
        {/* Right ribbon */}
        <div className="absolute top-0 right-0 bottom-0 w-0.5 flex flex-col">
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-[#FFD700]"></div>
          <div className="flex-1 bg-[#C0C0C0]"></div>
        </div>
        
        {/* Bottom ribbon */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-[#FFD700]"></div>
          <div className="flex-1 bg-[#C0C0C0]"></div>
        </div>
        
        {/* Left ribbon */}
        <div className="absolute top-0 left-0 bottom-0 w-0.5 flex flex-col">
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-[#FFD700]"></div>
          <div className="flex-1 bg-[#C0C0C0]"></div>
        </div>

        {/* Note content */}
        <div
          className="text-gray-800 flex items-center justify-center h-full"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          <p className="text-3xl md:text-4xl font-semibold tracking-wide text-center">
            平平安安 顺顺利利
          </p>
        </div>

      </div>
    </div>
  );
};
