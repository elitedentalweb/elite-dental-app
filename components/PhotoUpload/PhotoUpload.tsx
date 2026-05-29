'use client';
import { useRef, useState } from 'react';
import css from './PhotoUpload.module.css';

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

const PhotoUpload = ({ photos, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.url) urls.push(data.url);
      }
      onChange([...photos, ...urls]);
    } catch {
      console.log('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={css['photoUpload']}>
      <div className={css['grid']}>
        {photos.map((url, i) => (
          <div key={i} className={css['photoItem']}>
            <img
              src={url}
              alt={`photo-${i}`}
              className={css['photo']}
              onClick={() => setPreview(url)}
            />
            <button
              type="button"
              className={css['remove']}
              onClick={() => handleRemove(i)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={css['addBtn']}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '...' : '+'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleUpload}
      />

      {preview && (
        <div className={css['previewOverlay']} onClick={() => setPreview(null)}>
          <img src={preview} alt="preview" className={css['previewImg']} />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
