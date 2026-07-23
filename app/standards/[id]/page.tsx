import StandardPage from '@/components/Standard/StandardPage/StandardPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <StandardPage id={id} />;
};

export default Page;
