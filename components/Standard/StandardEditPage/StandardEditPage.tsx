'use client';
import { useEffect } from 'react';
import { useStandardStore } from '@/store/standardStore';
import StandardForm from '../StandardForm/StandardForm';

const StandardEditPage = ({ id }: { id: string }) => {
  const { currentStandard, fetchStandardById } = useStandardStore();

  useEffect(() => {
    fetchStandardById(id);
  }, [id]);

  if (!currentStandard) return null;

  return (
    <StandardForm
      mode="edit"
      id={id}
      initialTitle={currentStandard.title}
      initialDescription={currentStandard.description}
    />
  );
};

export default StandardEditPage;
