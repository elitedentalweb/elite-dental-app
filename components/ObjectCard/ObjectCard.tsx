'use client';
import css from './ObjectCard.module.css';
import { ObjectType } from '@/store/objectStore';
import Link from 'next/link';

type Props = {
  object: ObjectType;
  progress: number;
};

const ObjectCard = ({ object, progress }: Props) => {
  const isCompleted = object.status === 'completed';
  const barColor = isCompleted ? '#22c55e' : '#3b82f6';

  return (
    <Link href={`/objects/${object._id}`} className={css['objectCard']}>
      <div className={css['top']}>
        <div className={css['info']}>
          <h3 className={css['title']}>{object.title}</h3>
          <p className={css['client']}>{object.client}</p>
          <p className={css['location']}>{object.location}</p>
        </div>
        <div className={css['right']}>
          <p className={css['percent']}>{progress}%</p>
          <p
            className={css['status']}
            style={{ color: isCompleted ? '#22c55e' : '#3b82f6' }}
          >
            {isCompleted ? '● Completed' : '● In progress'}
          </p>
        </div>
      </div>
      <div className={css['progressBar']}>
        <div
          className={css['progressFill']}
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </div>
    </Link>
  );
};

export default ObjectCard;
