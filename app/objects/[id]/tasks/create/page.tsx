import TaskAdminPage from '@/components/TaskAdminPage/TaskAdminPage';

const Page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <TaskAdminPage objectId={id} />;
};

export default Page;
