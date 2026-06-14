import ProgressPage from '@/components/ProgressPage/ProgressPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProgressPage id={id} />;
};

export default Page;
