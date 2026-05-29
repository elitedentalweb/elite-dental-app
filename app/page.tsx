import ObjectList from '@/components/ObjectList/ObjectList';
import css from './page.module.css';

const Page = () => {
  return (
    <div className={css['page']}>
      <ObjectList />
    </div>
  );
};

export default Page;
