'use client';
import { useEffect, useState } from 'react';
import { useStandardEntryStore } from '@/store/standardEntryStore';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import css from './StandardEntryPage.module.css';

type Props = {
  entryId: string;
  standardId: string;
};

const StandardEntryPage = ({ entryId, standardId }: Props) => {
  const router = useRouter();
  const { currentEntry, fetchEntryById, deleteEntry } = useStandardEntryStore();
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchEntryById(entryId);
  }, [entryId]);

  if (!currentEntry) return <p className={css['loading']}>Loading...</p>;

  const handleDelete = async () => {
    await deleteEntry(entryId);
    router.push(`/standards/${standardId}`);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    setPreviewIndex(
      previewIndex === 0 ? currentEntry.photos.length - 1 : previewIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    setPreviewIndex(
      previewIndex === currentEntry.photos.length - 1 ? 0 : previewIndex + 1
    );
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex === null) return;
    const link = document.createElement('a');
    link.href = `/api/download?url=${encodeURIComponent(currentEntry.photos[previewIndex])}`;
    link.download = `photo-${previewIndex + 1}.jpg`;
    link.click();
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

      {currentEntry.photos && currentEntry.photos.length > 0 && (
        <div className={css['photos']}>
          {currentEntry.photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`photo-${i}`}
              className={css['photo']}
              onClick={() => setPreviewIndex(i)}
            />
          ))}
        </div>
      )}

      {previewIndex !== null && (
        <div className={css['overlay']} onClick={() => setPreviewIndex(null)}>
          <button className={css['navBtn']} onClick={handlePrev}>
            <ChevronLeft size={28} />
          </button>
          <img
            src={currentEntry.photos[previewIndex]}
            alt="preview"
            className={css['previewImg']}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={css['navBtn']} onClick={handleNext}>
            <ChevronRight size={28} />
          </button>
          <button
            className={css['closeBtn']}
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex(null);
            }}
          >
            <X size={20} />
          </button>
          <button className={css['downloadBtn']} onClick={handleDownload}>
            <Download size={20} />
          </button>
          <span className={css['counter']}>
            {previewIndex + 1} / {currentEntry.photos.length}
          </span>
        </div>
      )}

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
