import StandardEntryForm from '@/components/StandardEntry/StandardEntryForm/StandardEntryForm';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <StandardEntryForm mode="create" standardId={id} />;
};

export default Page;
