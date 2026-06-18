import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import css from '../login/page.module.css';

const Page = () => {
  return (
    <div className={css['page']}>
      <div className={css['left']}>
        <h1 className={css['brand']}>Elite Dental</h1>
      </div>
      <div className={css['right']}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default Page;
