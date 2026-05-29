import RegisterForm from '@/components/Auth/RegisterForm/RegisterForm';
import css from './page.module.css';

const Page = () => {
  return (
    <div className={css['page']}>
      <div className={css['left']}>
        <svg width={160} height={160} className={css['bigLogo']}>
          <use href="/logo-sprite.svg#icon-auth-logo"></use>
        </svg>
      </div>
      <div className={css['right']}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Page;
