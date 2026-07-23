'use client';
import { useEffect } from 'react';
import { useStandardStore } from '@/store/standardStore';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import css from './StandardList.module.css';

const StandardList = () => {
  const { standards, fetchStandards } = useStandardStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchStandards();
  }, []);

  return (
    <div className={css['sectionList']}>
      <div className={css['header']}>
        <h1 className={css['title']}>Standards</h1>
        {isAdmin && (
          <Link href="/standards/create" className={css['addButton']}>
            + Add Standard
          </Link>
        )}
      </div>
      <div className={css['list']}>
        {standards.length === 0 && (
          <p className={css['empty']}>No standards yet</p>
        )}
        {standards.map((standard) => (
          <Link
            key={standard._id}
            href={`/standards/${standard._id}`}
            className={css['card']}
          >
            <h2 className={css['cardTitle']}>{standard.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StandardList;
