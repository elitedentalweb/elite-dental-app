import ObjectEditPage from '@/components/ObjectEditPage/ObjectEditPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ObjectEditPage id={id} />;
};

export default Page;
