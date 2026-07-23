'use client';
import { useState } from 'react';
import { useStandardStore } from '@/store/standardStore';
import { useRouter } from 'next/navigation';
import css from './StandardForm.module.css';

type Props = {
  mode: 'create' | 'edit';
  id?: string;
  initialTitle?: string;
  initialDescription?: string;
};

const StandardForm = ({
  mode,
  id,
  initialTitle = '',
  initialDescription = '',
}: Props) => {
  const { createStandard, updateStandard } = useStandardStore();
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title) {
      setError('Please enter a title');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'create') {
        await createStandard({ title, description });
        router.push('/standards');
      } else if (mode === 'edit' && id) {
        await updateStandard(id, { title, description });
        router.push(`/standards/${id}`);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['sectionForm']}>
      <button className={css['back']} onClick={() => router.back()}>
        ← Back
      </button>
      <h1 className={css['title']}>
        {mode === 'create' ? 'Add Standard' : 'Edit Standard'}
      </h1>
      <form className={css['form']} onSubmit={handleSubmit}>
        <div className={css['field']}>
          <label className={css['label']}>Title *</label>
          <input
            className={css['input']}
            type="text"
            placeholder="e.g. TV Height"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={css['field']}>
          <label className={css['label']}>Description</label>
          <textarea
            className={css['textarea']}
            placeholder="Describe this standard..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        {error && <p className={css['error']}>{error}</p>}
        <button
          className={css['submitButton']}
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Standard'
              : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default StandardForm;
