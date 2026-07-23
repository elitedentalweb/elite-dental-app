'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import css from './PhotoGallery.module.css';

type Props = {
  photos: string[];
};

const PhotoGallery = ({ photos }: Props) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (photos.length === 0) return <p className={css['empty']}>No photos yet</p>;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    setPreviewIndex(previewIndex === 0 ? photos.length - 1 : previewIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    setPreviewIndex(previewIndex === photos.length - 1 ? 0 : previewIndex + 1);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    const url = photos[previewIndex];
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `photo-${previewIndex + 1}.jpg`;
    link.click();
    URL.revokeObjectURL(link.href);
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
        <div className={css['overlay']} onClick={() => setPreviewIndex(null)}>
          <button className={css['navBtn']} onClick={handlePrev}>
            <ChevronLeft size={28} />
          </button>
          <img
            src={photos[previewIndex]}
            alt="preview"
            className={css['previewImg']}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={css['navBtn']} onClick={handleNext}>
            <ChevronRight size={28} />
          </button>
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
