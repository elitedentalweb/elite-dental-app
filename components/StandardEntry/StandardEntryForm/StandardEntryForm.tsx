'use client';
import { useState } from 'react';
import { useStandardEntryStore } from '@/store/standardEntryStore';
import { useRouter } from 'next/navigation';
import css from './StandardEntryForm.module.css';

type Props = {
  mode: 'create' | 'edit';
  standardId: string;
  entryId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialPhotos?: string[];
};

const StandardEntryForm = ({
  mode,
  standardId,
  entryId,
  initialTitle = '',
  initialDescription = '',
  initialPhotos = [],
}: Props) => {
  const { createEntry, updateEntry } = useStandardEntryStore();
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        setError(`Photo "${file.name}" is too large. Maximum size is 20 MB.`);
        return;
      }
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
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

        newUrls.push(publicUrl);
      }
      setPhotos((prev) => [...prev, ...newUrls]);
    } catch {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title) {
      setError('Please enter a title');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'create') {
        await createEntry({ title, description, photos, standardId });
        router.push(`/standards/${standardId}`);
      } else if (mode === 'edit' && entryId) {
        await updateEntry(entryId, { title, description, photos });
        router.push(`/standards/${standardId}/entries/${entryId}`);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['photoForm']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>
        {mode === 'create' ? 'Add Entry' : 'Edit Entry'}
      </h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Title *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. TV mounting height"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Photos</label>
          <div className={css['grid']}>
            {photos.map((url, i) => (
              <div key={i} className={css['photoItem']}>
                <img src={url} alt={`photo-${i}`} className={css['preview']} />
                <button
                  type="button"
                  className={css['removeBtn']}
                  onClick={() => handleRemove(i)}
                >
                  ✕
                </button>
              </div>
            ))}
            <label className={css['uploadLabel']}>
              {uploading ? '...' : '+'}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Description</label>
          <textarea
            className={css['textarea']}
            placeholder="Describe this entry..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        {error && <p className={css['error']}>{error}</p>}
        <button
          className={css['submitButton']}
          type="submit"
          disabled={loading || uploading}
        >
          {loading
            ? 'Saving...'
            : mode === 'create'
              ? 'Add Entry'
              : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default StandardEntryForm;
