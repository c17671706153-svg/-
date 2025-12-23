import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PhotoData {
  id: string;
  dataUrl: string; // Base64 encoded image
  name: string;
  uploadedAt: number;
  note?: string; // Max 40 chars
}

interface PhotoContextType {
  photos: PhotoData[];
  selectedPhoto: PhotoData | null;
  highlightedPhotoId: string | null;
  oneFingerActive: boolean;
  twoFingerActive: boolean;
  twoFingerPhotoId: string | null;
  twoFingerFlip: boolean;
  scatterFlowAt: number | null;
  treeSpotlight: TreeSpotlight | null;
  addPhotos: (files: File[]) => Promise<void>;
  removePhoto: (id: string) => void;
  updatePhotoNote: (id: string, note: string) => void;
  reorderPhotos: (startIndex: number, endIndex: number) => void;
  clearPhotos: () => void;
  selectPhoto: (photo: PhotoData | null) => void;
  highlightRandomPhoto: () => void;
  setOneFingerActive: (active: boolean) => void;
  setTwoFingerActive: (active: boolean) => void;
  triggerScatterFlow: () => void;
  triggerTreeSpotlight: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

const STORAGE_KEY = 'christmas-tree-photos';
const MAX_PHOTOS = 50;
const MIN_PHOTOS = 5;

// Helper to convert file to base64
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to compress image if needed
const compressImage = (file: File, maxSize: number = 1024 * 1024): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        const ratio = Math.sqrt(maxSize / file.size);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

interface PhotoProviderProps {
  children: ReactNode;
  initialPhotos?: PhotoData[];
}

interface TreeSpotlight {
  photoId: string;
  flip: boolean;
  startedAt: number;
}

export const PhotoProvider: React.FC<PhotoProviderProps> = ({ children, initialPhotos }) => {
  const [photos, setPhotos] = useState<PhotoData[]>(() => {
    // Use initialPhotos if provided, otherwise empty array
    return initialPhotos || [];
  });
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [highlightedPhotoId, setHighlightedPhotoId] = useState<string | null>(null);
  const [oneFingerActive, setOneFingerActive] = useState(false);
  const [twoFingerActive, setTwoFingerActiveState] = useState(false);
  const [twoFingerPhotoId, setTwoFingerPhotoId] = useState<string | null>(null);
  const [twoFingerFlip, setTwoFingerFlip] = useState(false);
  const [scatterFlowAt, setScatterFlowAt] = useState<number | null>(null);
  const [treeSpotlight, setTreeSpotlight] = useState<TreeSpotlight | null>(null);

  // Load photos from localStorage on mount (only if no initial photos provided)
  useEffect(() => {
    if (initialPhotos !== undefined && initialPhotos.length > 0) {
      // Use initial photos, don't load from localStorage
      setPhotos(initialPhotos);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPhotos(parsed);
      }
    } catch (error) {
      console.error('Failed to load photos from storage:', error);
    }
  }, [initialPhotos]);

  // Save photos to localStorage whenever they change (only if not using initial photos)
  useEffect(() => {
    if (initialPhotos !== undefined && initialPhotos.length > 0) {
      // Don't save to localStorage if using initial photos (export mode)
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (error) {
      console.error('Failed to save photos to storage:', error);
    }
  }, [photos, initialPhotos]);

  const addPhotos = async (files: File[]) => {
    const newPhotos: PhotoData[] = [];

    for (const file of files) {
      // Check if we've reached the limit
      if (photos.length + newPhotos.length >= MAX_PHOTOS) {
        alert(`Maximum ${MAX_PHOTOS} photos allowed.`);
        break;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`);
        continue;
      }

      try {
        // Compress if needed
        const compressedFile = await compressImage(file);
        const dataUrl = await fileToDataUrl(compressedFile);

        newPhotos.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dataUrl,
          name: file.name,
          uploadedAt: Date.now(),
        });
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
      }
    }

    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((photo) => photo.id !== id);
      // Only enforce minimum if we already have photos
      if (prev.length >= MIN_PHOTOS && filtered.length < MIN_PHOTOS) {
        alert(`At least ${MIN_PHOTOS} photos are required to display on the Christmas tree.`);
        return prev;
      }
      return filtered;
    });
  };

  const updatePhotoNote = (id: string, note: string) => {
    setPhotos((prev) =>
      prev.map((p) => p.id === id ? { ...p, note: note.slice(0, 40) } : p)
    );
  };

  const reorderPhotos = (startIndex: number, endIndex: number) => {
    setPhotos((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearPhotos = () => {
    if (window.confirm('Are you sure you want to delete all photos? Photos on the Christmas tree will not display until you upload at least 5 photos again.')) {
      setPhotos([]);
    }
  };

  const selectPhoto = (photo: PhotoData | null) => {
    setSelectedPhoto(photo);
  };

  const highlightRandomPhoto = () => {
    if (photos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * photos.length);
    setHighlightedPhotoId(photos[randomIndex].id);

    // Auto clear highlight after 5 seconds
    setTimeout(() => {
      setHighlightedPhotoId(null);
    }, 5000);
  };

  const setTwoFingerActive = (active: boolean) => {
    if (active) {
      setTwoFingerActiveState(true);
      if (photos.length === 0) {
        console.debug('[two-finger] active, but no photos yet');
        return;
      }
      const randomIndex = Math.floor(Math.random() * photos.length);
      const selectedId = photos[randomIndex].id;
      const flip = Math.random() < 0.02;
      setTwoFingerPhotoId(selectedId);
      setTwoFingerFlip(flip);
      console.debug('[two-finger] context selection', selectedId, { flip });
      return;
    }
    setTwoFingerActiveState(false);
    setTwoFingerPhotoId(null);
    setTwoFingerFlip(false);
    console.debug('[two-finger] cleared');
  };

  useEffect(() => {
    if (!twoFingerActive || twoFingerPhotoId || photos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * photos.length);
    setTwoFingerPhotoId(photos[randomIndex].id);
    setTwoFingerFlip(Math.random() < 0.02);
  }, [twoFingerActive, twoFingerPhotoId, photos]);

  const triggerScatterFlow = () => {
    if (photos.length === 0) return;
    const startedAt = Date.now();
    setScatterFlowAt(startedAt);
    setTimeout(() => {
      setScatterFlowAt((current) => (current === startedAt ? null : current));
    }, 2600);
  };

  const triggerTreeSpotlight = () => {
    if (photos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * photos.length);
    const shouldFlip = Math.random() < 0.02;
    const startedAt = Date.now();
    const nextSpotlight: TreeSpotlight = {
      photoId: photos[randomIndex].id,
      flip: shouldFlip,
      startedAt,
    };
    setTreeSpotlight(nextSpotlight);
    setTimeout(() => {
      setTreeSpotlight((current) =>
        current?.photoId === nextSpotlight.photoId && current?.startedAt === startedAt ? null : current
      );
    }, 3500);
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        selectedPhoto,
        highlightedPhotoId,
        oneFingerActive,
        twoFingerActive,
        twoFingerPhotoId,
        twoFingerFlip,
        scatterFlowAt,
        treeSpotlight,
        addPhotos,
        removePhoto,
        updatePhotoNote,
        reorderPhotos,
        clearPhotos,
        selectPhoto,
        highlightRandomPhoto,
        setOneFingerActive,
        setTwoFingerActive,
        triggerScatterFlow,
        triggerTreeSpotlight,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = (): PhotoContextType => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
