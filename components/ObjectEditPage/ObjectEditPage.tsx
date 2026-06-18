'use client';
import { useEffect, useRef, useState } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useRouter } from 'next/navigation';
import css from './ObjectEditPage.module.css';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

type Props = {
  id: string;
};

const ObjectEditPage = ({ id }: Props) => {
  const { currentObject, fetchObjectById, updateObject } = useObjectStore();
  const router = useRouter();
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [priority, setPriority] = useState<
    'in_progress' | 'priority' | 'on_hold'
  >('in_progress');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchObjectById(id);
  }, [id]);

  useEffect(() => {
    if (!currentObject) return;

    queueMicrotask(() => {
      setTitle(currentObject.title);
      setClient(currentObject.client);
      setLocation(currentObject.location);
      setDescription(currentObject.description || '');
      setStatus(currentObject.status);
      setPriority(currentObject.priority ?? 'in_progress');
      setPhotosBefore(currentObject.photosBefore || []);
      setStartDate(
        new Date(currentObject.startDate).toISOString().split('T')[0]
      );
      setEndDate(new Date(currentObject.endDate).toISOString().split('T')[0]);
    });
  }, [currentObject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !client || !location || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await updateObject(id, {
        title,
        client,
        location,
        description,
        startDate,
        endDate,
        status,
        priority,
        photosBefore,
      });
      router.push(`/objects/${id}`);
    } catch {
      setError('Failed to update object');
    } finally {
      setLoading(false);
    }
  };

  if (!currentObject) return <p className={css['loading']}>Loading...</p>;

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>Edit Projects</h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Project name *</label>
          <input
            className={css['input']}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Client *</label>
          <input
            className={css['input']}
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Location *</label>
          <input
            className={css['input']}
            type="text"
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
          <label className={css['label']}>Status</label>
          <select
            className={css['input']}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'active' | 'completed')
            }
          >
            <option value="active">In progress</option>
            <option value="completed">Completed</option>
          </select>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ObjectEditPage;
