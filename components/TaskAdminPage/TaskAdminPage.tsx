'use client';
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';
import css from './TaskAdminPage.module.css';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

type Props = {
  objectId: string;
};

const TaskAdminPage = ({ objectId }: Props) => {
  const { createTask } = useTaskStore();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !total) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createTask({
        objectId,
        title,
        description,
        total,
        photos,
      });

      router.push(`/objects/${objectId}`);
    } catch {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['taskAdminPage']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>Add Task</h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Task name *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. Paint the walls"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Total amount *</label>
          <div className={css['totalWrapper']}>
            <input
              className={css['input']}
              type="number"
              min={1}
              value={total || ''}
              placeholder="0"
              onChange={(e) => setTotal(Number(e.target.value))}
            />
            <p className={css['totalHint']}>
              How many units need to be completed? (e.g. 10 walls, 5 rooms)
            </p>
          </div>
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Photos</label>
          <PhotoUpload photos={photos} onChange={setPhotos} />
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Description</label>
          <textarea
            className={css['textarea']}
            placeholder="Describe the task..."
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
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskAdminPage;
