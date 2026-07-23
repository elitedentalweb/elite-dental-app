'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import css from './PhotoGallery.module.css';

type Props = {
  photos: string[];
};

const PhotoGallery = ({ photos }: Props) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === 'ArrowRight') {
        setPreviewIndex(
          previewIndex === photos.length - 1 ? 0 : previewIndex + 1
        );
      }
      if (e.key === 'ArrowLeft') {
        setPreviewIndex(
          previewIndex === 0 ? photos.length - 1 : previewIndex - 1
        );
      }
      if (e.key === 'Escape') {
        setPreviewIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIndex, photos.length]);

  if (photos.length === 0) return <p className={css['empty']}>No photos yet</p>;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || previewIndex === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
      setPreviewIndex(
        previewIndex === photos.length - 1 ? 0 : previewIndex + 1
      );
    } else {
      setPreviewIndex(
        previewIndex === 0 ? photos.length - 1 : previewIndex - 1
      );
    }
    touchStartX.current = null;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    const link = document.createElement('a');
    link.href = `/api/download?url=${encodeURIComponent(photos[previewIndex])}`;
    link.download = `photo-${previewIndex + 1}.jpg`;
    link.click();
  };

  return (
    <div>
      <div className={css['grid']}>
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`photo-${i}`}
            className={css['photo']}
            onClick={() => setPreviewIndex(i)}
          />
        ))}
      </div>

      {previewIndex !== null && (
        <div
          className={css['overlay']}
          onClick={() => setPreviewIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={photos[previewIndex]}
            alt="preview"
            className={css['previewImg']}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={css['closeBtn']}
            onClick={() => setPreviewIndex(null)}
          >
            <X size={20} />
          </button>
          <button className={css['downloadBtn']} onClick={handleDownload}>
            <Download size={20} />
          </button>
          <span className={css['counter']}>
            {previewIndex + 1} / {photos.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
