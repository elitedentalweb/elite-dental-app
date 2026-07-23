'use client';
import { useEffect } from 'react';
import { useStandardEntryStore } from '@/store/standardEntryStore';
import StandardEntryForm from '../StandardEntryForm/StandardEntryForm';

const StandardEntryEditPage = ({
  standardId,
  entryId,
}: {
  standardId: string;
  entryId: string;
}) => {
  const { currentEntry, fetchEntryById } = useStandardEntryStore();

  useEffect(() => {
    fetchEntryById(entryId);
  }, [entryId]);

  if (!currentEntry) return null;

  return (
    <StandardEntryForm
      mode="edit"
      standardId={standardId}
      entryId={entryId}
      initialTitle={currentEntry.title}
      initialDescription={currentEntry.description}
      initialPhotos={currentEntry.photos}
    />
  );
};

export default StandardEntryEditPage;
