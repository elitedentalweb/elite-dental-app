import StandardEntryEditPage from '@/components/StandardEntry/StandardEntryEditPage/StandardEntryEditPage';

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) => {
  const { id, entryId } = await params;
  return <StandardEntryEditPage standardId={id} entryId={entryId} />;
};

export default Page;
