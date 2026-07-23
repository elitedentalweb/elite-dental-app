import StandardEntryPage from '@/components/StandardEntry/StandardEntryPage/StandardEntryPage';

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) => {
  const { id, entryId } = await params;
  return <StandardEntryPage standardId={id} entryId={entryId} />;
};

export default Page;
