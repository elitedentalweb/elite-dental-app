import ObjectPage from '@/components/ObjectPage/ObjectPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ObjectPage id={id} />;
};

export default Page;
