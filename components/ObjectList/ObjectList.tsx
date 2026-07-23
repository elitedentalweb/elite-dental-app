'use client';
import { useEffect } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/auth';
import ObjectCard from '../ObjectCard/ObjectCard';
import Link from 'next/link';
import css from './ObjectList.module.css';
const priorityOrder = {
  priority: 0,
  in_progress: 1,
  planned: 2,
  on_hold: 3,
  completed: 4,
};

const ObjectList = () => {
  const { objects, fetchObjects } = useObjectStore();
  const { fetchObjectProgress, progressMap } = useTaskStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchObjects();
  }, []);

  useEffect(() => {
    objects.forEach((object) => {
      fetchObjectProgress(object._id);
    });
  }, [objects]);

  const activeObjects = objects
    .filter((o) => o.status === 'active')
    .sort((a, b) => {
      const aPriority = priorityOrder[a.priority ?? 'in_progress'];
      const bPriority = priorityOrder[b.priority ?? 'in_progress'];
      return aPriority - bPriority;
    });

  return (
    <div className={css['objectList']}>
      <div className={css['header']}>
        <h1 className={css['title']}>Projects</h1>
        <div className={css['headerRight']}>
          {isAdmin && (
            <Link href="/objects/completed" className={css['completedButton']}>
              Completed Projects
            </Link>
          )}
          {isAdmin && (
            <Link href="/objects/create" className={css['addButton']}>
              Add Projects
            </Link>
          )}
        </div>
      </div>
      {activeObjects.length === 0 && (
        <p className={css['empty']}>No active Projects</p>
      )}
      {activeObjects.map((object) => (
        <ObjectCard
          key={object._id}
          object={object}
          progress={progressMap[object._id] ?? 0}
        />
      ))}
    </div>
  );
};

export default ObjectList;
