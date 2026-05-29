'use client';
import { useState } from 'react';
import css from './PhotoGallery.module.css';

type Props = {
  photos: string[];
};

const PhotoGallery = ({ photos }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  if (photos.length === 0) return <p className={css['empty']}>No photos yet</p>;

  return (
    <div>
      <div className={css['grid']}>
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`photo-${i}`}
            className={css['photo']}
            onClick={() => setPreview(url)}
          />
        ))}
      </div>
      {preview && (
        <div className={css['overlay']} onClick={() => setPreview(null)}>
          <img src={preview} alt="preview" className={css['previewImg']} />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
