'use client';
import { useEffect } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/auth';
import ObjectCard from '../ObjectCard/ObjectCard';
import Link from 'next/link';
import css from './ObjectList.module.css';

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

  return (
    <div className={css['objectList']}>
      <div className={css['header']}>
        <h1 className={css['title']}>Objects</h1>
        {isAdmin && (
          <Link href="/objects/create" className={css['addButton']}>
            Add Object
          </Link>
        )}
      </div>
      {objects.map((object) => (
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
