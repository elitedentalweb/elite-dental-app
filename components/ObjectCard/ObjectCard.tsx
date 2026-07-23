'use client';
import css from './ObjectCard.module.css';
import { ObjectType } from '@/store/objectStore';
import Link from 'next/link';

type Props = {
  object: ObjectType;
  progress: number;
};

const priorityConfig = {
  planned: { color: '#a855f7', label: '● Planned' },
  in_progress: { color: '#3b82f6', label: '● In Progress' },
  priority: { color: '#ef4444', label: '● Priority' },
  on_hold: { color: '#6b7280', label: '● On Hold' },
  completed: { color: '#22c55e', label: '● Completed' },
};

const ObjectCard = ({ object, progress }: Props) => {
  const priority = object.priority ?? 'in_progress';
  const config = priorityConfig[priority];
  const barColor = config.color;
  const statusColor = config.color;
  const statusLabel = config.label;

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
          <p className={css['status']} style={{ color: statusColor }}>
            {statusLabel}
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
