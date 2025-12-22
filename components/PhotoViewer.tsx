import React, { useEffect } from 'react';
import { usePhotos } from '../contexts/PhotoContext';

export const PhotoViewer: React.FC = () => {
  const { selectedPhoto, selectPhoto, photos, updatePhotoNote } = usePhotos();
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempNote, setTempNote] = React.useState('');

  useEffect(() => {
    if (selectedPhoto) {
      setTempNote(selectedPhoto.note || '');
    }
  }, [selectedPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === 'Escape') {
        selectPhoto(null);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        if (currentIndex > 0) {
          selectPhoto(photos[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowRight') {
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        if (currentIndex < photos.length - 1) {
          selectPhoto(photos[currentIndex + 1]);
        }
      }
    };

    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto, photos, selectPhoto]);

  if (!selectedPhoto) return null;

  const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      selectPhoto(photos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      selectPhoto(photos[currentIndex + 1]);
    }
  };

  const handleClose = () => {
    selectPhoto(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all z-10"
          aria-label="关闭"
        >
          ×
        </button>

        {/* Previous Button */}
        {hasPrevious && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all z-10"
            aria-label="上一张"
          >
            ‹
          </button>
        )}

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all z-10"
            aria-label="下一张"
          >
            ›
          </button>
        )}

        {/* Polaroid Frame with Photo */}
        <div className="relative flex items-center justify-center max-w-2xl w-full px-8">
          <div className="relative bg-[#f0f0f0] rounded-lg shadow-2xl overflow-hidden" style={{ aspectRatio: '4/5', maxHeight: '80vh' }}>
            {/* Photo Area (upper part) */}
            <div className="relative w-full" style={{ height: '87.5%', padding: '1.5rem' }}>
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.name}
                className="w-full h-full object-cover rounded-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {/* Bottom white space with Note Editor */}
            <div className={`relative w-full flex flex-col items-center justify-center ${!selectedPhoto.note ? 'cursor-text group' : ''}`}
              style={{ height: '12.5%', padding: '0 1.5rem' }}
              onClick={(e) => {
                e.stopPropagation();
                // Only allow editing if no note exists
                if (!selectedPhoto.note) {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  type="text"
                  maxLength={40}
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  onBlur={() => {
                    setIsEditing(false);
                    if (selectedPhoto && tempNote.trim()) {
                      updatePhotoNote(selectedPhoto.id, tempNote);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                    e.stopPropagation(); // Prevent navigation
                  }}
                  className="w-full text-center bg-transparent border-b border-[#333] text-[#333] font-handwriting focus:outline-none text-base font-medium placeholder-gray-400"
                  placeholder="写点什么... (Enter保存)"
                />
              ) : (
                <div className="w-full text-center">
                  <p className={`font-handwriting text-[#333] text-base ${!selectedPhoto.note ? 'opacity-30 italic' : ''}`}>
                    {selectedPhoto.note || '点击添加备注 (仅限一次)...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

