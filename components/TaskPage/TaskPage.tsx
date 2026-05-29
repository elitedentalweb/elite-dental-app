'use client';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './TaskPage.module.css';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

type Props = {
  taskId: string;
  objectId: string;
};

const TaskPage = ({ taskId, objectId }: Props) => {
  const router = useRouter();
  const { currentTask, fetchTaskById, updateTask } = useTaskStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';
  const isWorker = user?.role === 'worker';
  const canEdit = isAdmin || isWorker;

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId]);

  if (!currentTask) return <p className={css['loading']}>Loading...</p>;

  const handleDec = async () => {
    if (currentTask.current <= 0) return;
    await updateTask(taskId, { current: currentTask.current - 1 });
  };

  const handleInc = async () => {
    if (currentTask.current >= currentTask.total) return;
    await updateTask(taskId, { current: currentTask.current + 1 });
  };

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css['header']}>
        <h1 className={css['title']}>{currentTask.title}</h1>
        {isAdmin && (
          <Link
            href={`/objects/${objectId}/tasks/${taskId}/edit`}
            className={css['editButton']}
          >
            ✏️ Edit
          </Link>
        )}
      </div>

      {currentTask.description && (
        <div className={css['section']}>
          <h2 className={css['sectionTitle']}>Description</h2>
          <p className={css['description']}>{currentTask.description}</p>
        </div>
      )}

      <div className={css['section']}>
        <h2 className={css['sectionTitle']}>Gallery</h2>
        <PhotoGallery photos={currentTask.photos} />
      </div>

      <div className={css['progressBlock']}>
        <h2 className={css['sectionTitle']}>Progress</h2>
        {canEdit && (
          <div className={css['controls']}>
            <button className={css['btn']} onClick={handleDec}>
              −
            </button>
            <span className={css['count']}>
              {currentTask.current} / {currentTask.total}
            </span>
            <button className={css['btn']} onClick={handleInc}>
              +
            </button>
          </div>
        )}
        {!canEdit && (
          <p className={css['countReadonly']}>
            {currentTask.current} / {currentTask.total}
          </p>
        )}
        <div className={css['progressBar']}>
          <div
            className={css['progressFill']}
            style={{ width: `${currentTask.progress}%` }}
          />
        </div>
        <p className={css['progressPercent']}>{currentTask.progress}%</p>
      </div>
    </div>
  );
};

export default TaskPage;
