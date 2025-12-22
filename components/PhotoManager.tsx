import React, { useState, useRef, useCallback } from 'react';
import { usePhotos } from '../contexts/PhotoContext';
import { COLORS } from '../constants';

interface PhotoManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({ isOpen, onClose }) => {
  const { photos, addPhotos, removePhoto, reorderPhotos, clearPhotos, updatePhotoNote } = usePhotos();
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      await addPhotos(fileArray);
    },
    [addPhotos]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Internal drag and drop for reordering
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDragIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) return;
    reorderPhotos(dragIndex, targetIndex);
    setDragIndex(targetIndex);
  };

  const handleItemDragEnd = () => {
    setDragIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-black/90 border border-white/20 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-none">
          <h2 className="text-2xl font-light tracking-wider text-[#B8860B]">
            照片管理
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
              ? 'border-[#B8860B] bg-[#B8860B]/10'
              : 'border-white/20 hover:border-white/40'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="text-4xl">📸</div>
              <div>
                <p className="text-white/80 mb-2">
                  将照片拖拽到此处，或{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#B8860B] hover:text-[#FFD700] underline"
                  >
                    点击选择
                  </button>
                </p>
                <p className="text-white/50 text-sm">
                  支持 5-50 张照片，格式：JPG、PNG、GIF
                </p>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          {photos.length > 0 ? (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/60 text-sm">
                  已上传 {photos.length} / 50 张照片
                </p>
                {photos.length >= 5 && (
                  <button
                    onClick={clearPhotos}
                    className="text-red-400/80 hover:text-red-400 text-sm transition-colors"
                  >
                    清空所有
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleItemDragStart(e, index)}
                    onDragEnd={handleItemDragEnd}
                    onDragOver={(e) => handleItemDragOver(e, index)}
                    className={`relative group cursor-move flex flex-col gap-2 ${dragIndex === index ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="aspect-[3/4] bg-white/5 rounded-lg overflow-hidden border border-white/10 relative">
                      <img
                        src={photo.dataUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs z-10"
                      >
                        ×
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="添加备注 (40字)"
                      maxLength={40}
                      value={photo.note || ''}
                      onChange={(e) => updatePhotoNote && updatePhotoNote(photo.id, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#B8860B] transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center text-white/40 py-12">
              <p>尚未上传照片</p>
              <p className="text-sm mt-2">至少需要上传 {5} 张照片</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
