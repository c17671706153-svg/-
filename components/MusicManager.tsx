import React, { useState, useRef, useCallback } from 'react';
import { useMusic } from '../contexts/MusicContext';

interface MusicManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicManager: React.FC<MusicManagerProps> = ({ isOpen, onClose }) => {
  const { currentMusic, defaultMusic, specialMusic, addMusicFromFile, addMusicFromUrl, removeMusic } = useMusic();
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [uploadingFor, setUploadingFor] = useState<'default' | 'special'>('default');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const specialFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null, isSpecial: boolean = false) => {
      if (!files || files.length === 0) return;
      
      const file = files[0];
      await addMusicFromFile(file, isSpecial);
    },
    [addMusicFromFile]
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

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      alert('请输入有效的音频 URL。');
      return;
    }
    addMusicFromUrl(urlInput.trim(), urlName.trim() || '来自 URL 的音乐', uploadingFor === 'special');
    setUrlInput('');
    setUrlName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-light text-white tracking-wider">音乐管理</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Default Music Upload Section */}
          <div className="mb-8">
            <h3 className="text-white/80 text-sm mb-4 uppercase tracking-wider">默认音乐（背景）</h3>
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelect(e.dataTransfer.files, false);
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging && uploadingFor === 'default'
                  ? 'border-[#B8860B] bg-[#B8860B]/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileSelect(e.target.files, false)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">🎵</div>
                <p className="text-white/60 text-sm">
                  将音频文件拖拽到此处，或{' '}
                  <button
                    onClick={() => {
                      setUploadingFor('default');
                      fileInputRef.current?.click();
                    }}
                    className="text-[#B8860B] hover:text-[#FFD700] underline"
                  >
                    点击选择
                  </button>
                </p>
                <p className="text-white/40 text-xs">
                  支持：MP3、WAV、OGG、M4A、AAC、MP4、WEBM、MOV、AVI（最大 50MB）
                </p>
              </div>
            </div>
            {defaultMusic && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm mb-1">当前默认音乐</p>
                <p className="text-white text-base">{defaultMusic.name}</p>
                <button
                  onClick={() => removeMusic(false)}
                  className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors"
                >
                  移除
                </button>
              </div>
            )}
          </div>

          {/* Special Music Upload Section (for star click) */}
          <div className="mb-8">
            <h3 className="text-white/80 text-sm mb-4 uppercase tracking-wider">特殊音乐（点击星星）</h3>
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelect(e.dataTransfer.files, true);
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging && uploadingFor === 'special'
                  ? 'border-[#B8860B] bg-[#B8860B]/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <input
                ref={specialFileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileSelect(e.target.files, true)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">⭐</div>
                <p className="text-white/60 text-sm">
                  将音频文件拖拽到此处，或{' '}
                  <button
                    onClick={() => {
                      setUploadingFor('special');
                      specialFileInputRef.current?.click();
                    }}
                    className="text-[#B8860B] hover:text-[#FFD700] underline"
                  >
                    点击选择
                  </button>
                </p>
                <p className="text-white/40 text-xs">
                  点击树上的星星时将播放此音乐。支持视频文件，会提取其中的音频。
                </p>
              </div>
            </div>
            {specialMusic && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm mb-1">当前特殊音乐</p>
                <p className="text-white text-base">{specialMusic.name}</p>
                <button
                  onClick={() => removeMusic(true)}
                  className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors"
                >
                  移除
                </button>
              </div>
            )}
          </div>

          {/* URL Input Section */}
          <div className="mb-8">
            <h3 className="text-white/80 text-sm mb-4 uppercase tracking-wider">或输入音频 URL</h3>
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setUploadingFor('default')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    uploadingFor === 'default'
                      ? 'bg-[#B8860B] text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  用于默认
                </button>
                <button
                  onClick={() => setUploadingFor('special')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    uploadingFor === 'special'
                      ? 'bg-[#B8860B] text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  用于特殊
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="音频 URL（例如：https://example.com/music.mp3）"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#B8860B] transition-colors"
              />
              <input
                type="text"
                placeholder="音乐名称（可选）"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#B8860B] transition-colors"
              />
              <button
                onClick={handleUrlSubmit}
                className="w-full px-6 py-3 bg-[#B8860B] hover:bg-[#FFD700] text-black rounded-lg font-medium transition-colors"
              >
                通过 URL 添加音乐（{uploadingFor === 'default' ? '默认' : '特殊'}）
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">
              💡 提示：对于 YouTube 视频，可以用在线工具提取音频并获取直链 URL
            </p>
          </div>

          {/* Current Playing Music Display */}
          {currentMusic && (
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white/80 text-sm mb-1">当前播放</p>
                  <p className="text-white text-lg font-light">{currentMusic.name}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {currentMusic === defaultMusic ? '默认音乐' : currentMusic === specialMusic ? '特殊音乐' : '未知'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



