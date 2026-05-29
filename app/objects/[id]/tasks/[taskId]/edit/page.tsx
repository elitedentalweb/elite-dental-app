import TaskEditPage from '@/components/TaskEditPage/TaskEditPage';

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = await params;
  return <TaskEditPage taskId={taskId} objectId={id} />;
};

export default Page;
