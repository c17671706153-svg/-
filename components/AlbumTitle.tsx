import React from 'react';

export const AlbumTitle: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-8 pointer-events-none">
      <div className="text-center">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-light tracking-widest"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.8)',
            letterSpacing: '0.2em'
          }}
        >
          圣诞快乐
        </h1>
        <p 
          className="text-sm md:text-base lg:text-lg mt-2 font-light tracking-wide"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.3), 0 1px 5px rgba(0, 0, 0, 0.6)',
            letterSpacing: '0.1em',
            opacity: 0.9
          }}
        >
          2025年11月21日 - 2025年11月25日
        </p>
      </div>
    </div>
  );
};

