'use client';
import { useEffect, useState } from 'react';
import { useStandardStore } from '@/store/standardStore';
import { useStandardEntryStore } from '@/store/standardEntryStore';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './StandardPage.module.css';

type Props = {
  id: string;
};

const StandardPage = ({ id }: Props) => {
  const router = useRouter();
  const { currentStandard, fetchStandardById, deleteStandard } =
    useStandardStore();
  const { entries, fetchEntries } = useStandardEntryStore();
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchStandardById(id);
    fetchEntries(id);
  }, [id]);

  if (!currentStandard) return <p className={css['loading']}>Loading...</p>;

  const handleDelete = async () => {
    await deleteStandard(id);
    router.push('/standards');
  };

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css['header']}>
        <h1 className={css['title']}>{currentStandard.title}</h1>
        {isAdmin && (
          <div className={css['actions']}>
            <Link href={`/standards/${id}/edit`} className={css['editButton']}>
              ✏️ Edit
            </Link>
            <button
              className={css['deleteButton']}
              onClick={() => setShowConfirm(true)}
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {currentStandard.description && (
        <p className={css['description']}>{currentStandard.description}</p>
      )}

      <div className={css['photosSection']}>
        <h2 className={css['sectionTitle']}>Entries</h2>
        <div className={css['grid']}>
          {entries.length === 0 && (
            <p className={css['empty']}>No entries yet</p>
          )}
          {entries.map((entry) => (
            <Link
              key={entry._id}
              href={`/standards/${id}/entries/${entry._id}`}
              className={css['photoCard']}
            >
              {entry.photos?.[0] && (
                <img
                  src={entry.photos[0]}
                  alt={entry.title}
                  className={css['photo']}
                />
              )}
              <p className={css['photoTitle']}>{entry.title}</p>
            </Link>
          ))}
        </div>
        {isAdmin && (
          <Link
            href={`/standards/${id}/entries/create`}
            className={css['addPhoto']}
          >
            + Add Entry
          </Link>
        )}
      </div>

      {showConfirm && (
        <div className={css['overlay']}>
          <div className={css['modal']}>
            <p className={css['modalText']}>
              Are you sure you want to delete this standard?
            </p>
            <div className={css['modalButtons']}>
              <button
                className={css['cancelButton']}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className={css['confirmButton']} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardPage;
