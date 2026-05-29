import TaskPage from '@/components/TaskPage/TaskPage';

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = await params;
  return <TaskPage taskId={taskId} objectId={id} />;
};

export default Page;
