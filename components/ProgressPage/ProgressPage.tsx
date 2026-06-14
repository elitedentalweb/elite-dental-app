'use client';
import { useEffect, useState, useRef } from 'react';
import { useObjectStore } from '@/store/objectStore';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';
import css from './ProgressPage.module.css';

type Props = {
  id: string;
};

const ProgressPage = ({ id }: Props) => {
  const router = useRouter();
  const { currentObject, fetchObjectById, updateManualProgress } =
    useObjectStore();
  const { fetchObjectProgress, progressMap } = useTaskStore();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    fetchObjectById(id);
    fetchObjectProgress(id);
  }, [id]);

  useEffect(() => {
    if (currentObject && !initialized.current) {
      initialized.current = true;
      setValue(currentObject.manualProgress ?? 0);
    }
  }, [currentObject]);

  if (!currentObject) return <p className={css['loading']}>Loading...</p>;

  const autoProgress = progressMap[id] ?? 0;
  const manualProgress = currentObject.manualProgress ?? 0;
  const remaining = 100 - manualProgress;
  const finalProgress = Math.max(autoProgress, manualProgress);
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateManualProgress(id, value);
      await fetchObjectProgress(id);
      await fetchObjectById(id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>

      <h1 className={css['title']}>Overall Progress</h1>
      <p className={css['subtitle']}>{currentObject.title}</p>

      <div className={css['card']}>
        <div className={css['progressHeader']}>
          <span className={css['label']}>Current Progress</span>
          <span className={css['percent']}>{finalProgress}%</span>
        </div>
        <div className={css['progressBar']}>
          <div
            className={css['progressFill']}
            style={{ width: `${finalProgress}%` }}
          />
        </div>
      </div>

      <div className={css['card']}>
        <div className={css['row']}>
          <span className={css['label']}>Auto (from tasks)</span>
          <span className={css['value']}>{autoProgress}%</span>
        </div>
        <div className={css['row']}>
          <span className={css['label']}>Manual override</span>
          <span className={css['value']}>
            {currentObject.manualProgress ?? 0}%
          </span>
        </div>
      </div>

      <div className={css['card']}>
        <p className={css['label']}>Set manual progress</p>
        <div className={css['sliderRow']}>
          <input
            className={css['slider']}
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <span className={css['sliderValue']}>{value}%</span>
        </div>
        <div className={css['inputRow']}>
          <input
            className={css['input']}
            type="number"
            min={0}
            max={100}
            value={value === 0 ? '' : value}
            placeholder="0"
            onChange={(e) => {
              const v =
                e.target.value === ''
                  ? 0
                  : Math.min(100, Math.max(0, Number(e.target.value)));
              setValue(v);
            }}
          />
          <button
            className={css['saveBtn']}
            onClick={handleSave}
            disabled={loading}
          >
            {saved ? '✓ Saved' : loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
