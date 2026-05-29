'use client';
import { useEffect, useState } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './ObjectPage.module.css';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

type Props = {
  id: string;
};

const ObjectPage = ({ id }: Props) => {
  const router = useRouter();
  const { currentObject, fetchObjectById, deleteObject } = useObjectStore();
  const { tasks, fetchTasks, fetchObjectProgress, progressMap } =
    useTaskStore();
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    await deleteObject(id);
    router.push('/');
  };

  useEffect(() => {
    fetchObjectById(id);
    fetchTasks(id);
    fetchObjectProgress(id);
  }, [id]);

  if (!currentObject) return <p className={css['loading']}>Loading...</p>;

  const progress = progressMap[id] ?? 0;

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css['header']}>
        <h1 className={css['title']}>{currentObject.title}</h1>
        {isAdmin && (
          <Link href={`/objects/${id}/edit`} className={css['editButton']}>
            ✏️ Edit
          </Link>
        )}
        {isAdmin && (
          <>
            <button
              className={css['deleteButton']}
              onClick={() => setShowConfirm(true)}
            >
              🗑 Delete
            </button>
            {showConfirm && (
              <div className={css['overlay']}>
                <div className={css['modal']}>
                  <p className={css['modalText']}>
                    Are you sure you want to delete this object?
                  </p>
                  <div className={css['modalButtons']}>
                    <button
                      className={css['cancelButton']}
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={css['confirmButton']}
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={css['meta']}>
        <div className={css['metaItem']}>
          <span className={css['metaIcon']}>🏢</span>
          <span className={css['metaValue']}>{currentObject.client}</span>
        </div>
        <div className={css['metaItem']}>
          <span className={css['metaIcon']}>📍</span>
          <span className={css['metaValue']}>{currentObject.location}</span>
        </div>
        <div className={css['metaItem']}>
          <span className={css['metaIcon']}>📅</span>
          <span className={css['metaValue']}>
            {new Date(currentObject.startDate).toLocaleDateString('ru-RU')} —{' '}
            {new Date(currentObject.endDate).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>

      <div className={css['progressBlock']}>
        <div className={css['progressHeader']}>
          <span className={css['progressLabel']}>Overall Progress</span>
          <span className={css['progressPercent']}>{progress}%</span>
        </div>
        <div className={css['progressBar']}>
          <div
            className={css['progressFill']}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={css['section']}>
        <h2 className={css['sectionTitle']}>Gallery</h2>
        <PhotoGallery photos={currentObject.photosBefore} />
      </div>

      {currentObject.description && (
        <div className={css['section']}>
          <h2 className={css['sectionTitle']}>Description</h2>
          <p className={css['description']}>{currentObject.description}</p>
        </div>
      )}

      <div className={css['section']}>
        <h2 className={css['sectionTitle']}>Tasks</h2>
        <div className={css['taskList']}>
          {tasks.length === 0 && <p className={css['empty']}>No tasks yet</p>}
          {tasks.map((task) => (
            <Link
              key={task._id}
              href={`/objects/${id}/tasks/${task._id}`}
              className={css['taskCard']}
            >
              <div className={css['taskTop']}>
                <span className={css['taskTitle']}>{task.title}</span>
                <span className={css['taskPercent']}>{task.progress}%</span>
              </div>
              <div className={css['taskBar']}>
                <div
                  className={css['taskFill']}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
        {isAdmin && (
          <Link href={`/objects/${id}/tasks/create`} className={css['addTask']}>
            + Add Task
          </Link>
        )}
      </div>
    </div>
  );
};

export default ObjectPage;
