'use client';
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';
import css from './TaskEditPage.module.css';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

type Props = {
  taskId: string;
  objectId: string;
};

const TaskEditPage = ({ taskId, objectId }: Props) => {
  const { currentTask, fetchTaskById, updateTask } = useTaskStore();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId]);

  useEffect(() => {
    if (!currentTask) return;

    queueMicrotask(() => {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setTotal(currentTask.total);
      setPhotos(currentTask.photos || []);
    });
  }, [currentTask]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !total) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await updateTask(taskId, { title, description, total, photos });

      router.push(`/objects/${objectId}/tasks/${taskId}`);
    } catch {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (!currentTask) return <p className={css['loading']}>Loading...</p>;

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>Edit Task</h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Task name *</label>
          <input
            className={css['input']}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Total amount *</label>
          <input
            className={css['input']}
            type="number"
            min={1}
            value={total || ''}
            placeholder="0"
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </div>

        <div className={css['field']}>
          <label className={css['label']}>Photos</label>
          <PhotoUpload photos={photos} onChange={setPhotos} />
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

export default TaskEditPage;
