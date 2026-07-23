import StandardEditPage from '@/components/Standard/StandardEditPage/StandardEditPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <StandardEditPage id={id} />;
};

export default Page;
