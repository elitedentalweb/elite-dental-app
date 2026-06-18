'use client';
import { useRef, useState } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useRouter } from 'next/navigation';
import css from './ObjectAdminPage.module.css';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

const ObjectAdminPage = () => {
  const { createObject } = useObjectStore();
  const router = useRouter();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<
    'in_progress' | 'priority' | 'on_hold'
  >('in_progress');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !client || !location || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createObject({
        title,
        client,
        location,
        description,
        startDate,
        endDate,
        photosBefore,
        priority,
      });

      router.push('/');
    } catch {
      setError('Failed to create object');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['objectAdminPage']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>Add Projects</h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Project name *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. Residential complex"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Client *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. John Smith"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Location *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. Kyiv, Khreshchatyk 1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className={css['dates']}>
          <div className={css['field']}>
            <label className={css['label']}>Start date *</label>
            <input
              ref={startDateRef}
              className={css['input']}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={() => startDateRef.current?.showPicker()}
            />
          </div>
          <div className={css['field']}>
            <label className={css['label']}>End date *</label>
            <input
              ref={endDateRef}
              className={css['input']}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={() => endDateRef.current?.showPicker()}
            />
          </div>
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Priority</label>
          <select
            className={css['input']}
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value as 'in_progress' | 'priority' | 'on_hold'
              )
            }
          >
            <option value="in_progress">🔵 In Progress</option>
            <option value="priority">🔴 Priority</option>
            <option value="on_hold">⚫ On Hold</option>
          </select>
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Photos</label>
          <PhotoUpload photos={photosBefore} onChange={setPhotosBefore} />
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Description</label>
          <textarea
            className={css['textarea']}
            placeholder="Describe the project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        {error && <p className={css['error']}>{error}</p>}
        <button
          className={css['submitButton']}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default ObjectAdminPage;
