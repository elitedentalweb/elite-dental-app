'use client';
import { useEffect, useState } from 'react';
import { useStandardEntryStore } from '@/store/standardEntryStore';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './StandardEntryPage.module.css';
import PhotoGallery from '../../PhotoGallery/PhotoGallery';

type Props = {
  entryId: string;
  standardId: string;
};

const StandardEntryPage = ({ entryId, standardId }: Props) => {
  const router = useRouter();
  const { currentEntry, fetchEntryById, deleteEntry } = useStandardEntryStore();
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchEntryById(entryId);
  }, [entryId]);

  if (!currentEntry) return <p className={css['loading']}>Loading...</p>;

  const handleDelete = async () => {
    await deleteEntry(entryId);
    router.push(`/standards/${standardId}`);
  };

  return (
    <div className={css['page']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css['header']}>
        <h1 className={css['title']}>{currentEntry.title}</h1>
        {isAdmin && (
          <div className={css['actions']}>
            <Link
              href={`/standards/${standardId}/entries/${entryId}/edit`}
              className={css['editButton']}
            >
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

      {currentEntry.description && (
        <div className={css['section']}>
          <h2 className={css['sectionTitle']}>Description</h2>
          <p className={css['description']}>{currentEntry.description}</p>
        </div>
      )}

      <div className={css['section']}>
        <h2 className={css['sectionTitle']}>Photos</h2>
        <PhotoGallery photos={currentEntry.photos} />
      </div>

      {showConfirm && (
        <div className={css['overlay']}>
          <div className={css['modal']}>
            <p className={css['modalText']}>
              Are you sure you want to delete this entry?
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

export default StandardEntryPage;
