'use client';
import { useEffect } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/auth';
import ObjectCard from '../ObjectCard/ObjectCard';
import { useRouter } from 'next/navigation';
import css from './CompletedObjectList.module.css';

const CompletedObjectList = () => {
  const { objects, fetchObjects } = useObjectStore();
  const { fetchObjectProgress, progressMap } = useTaskStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchObjects();
  }, []);

  useEffect(() => {
    objects.forEach((object) => {
      fetchObjectProgress(object._id);
    });
  }, [objects]);

  const completedObjects = objects.filter((o) => o.status === 'completed');

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>Completed Projects</h1>
      {completedObjects.length === 0 && (
        <p className={css['empty']}>No completed projects yet</p>
      )}
      {completedObjects.map((object) => (
        <ObjectCard
          key={object._id}
          object={object}
          progress={progressMap[object._id] ?? 0}
        />
      ))}
    </div>
  );
};

export default CompletedObjectList;
