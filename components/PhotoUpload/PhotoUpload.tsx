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
  const [error, setError] = useState<string | null>(null);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');

        const MAX_SIZE = 1920;
        let width = img.width;
        let height = img.height;

        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = url;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        setError(`Photo "${file.name}" is too large. Maximum size is 20 MB.`);
        return;
      }
    }

    if (uploading) {
      setError('Please wait, previous photos are still uploading...');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const urls: string[] = [];

      for (const file of Array.from(files)) {
        const compressed = await compressImage(file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: compressed.name,
            fileType: compressed.type,
          }),
        });

        const { presignedUrl, publicUrl } = await res.json();

        await fetch(presignedUrl, {
          method: 'PUT',
          body: compressed,
          headers: { 'Content-Type': compressed.type },
        });

        urls.push(publicUrl);
      }

      onChange([...photos, ...urls]);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={css['photoUpload']}>
      {error && <div className={css['error']}>{error}</div>}

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
          onClick={() => {
            setError(null);
            inputRef.current?.click();
          }}
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
