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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.url) newUrls.push(data.url);
      }
      setPhotos((prev) => [...prev, ...newUrls]);
    } catch {
      setError('Failed to upload photo');
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
