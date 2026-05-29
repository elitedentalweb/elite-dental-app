import css from './PendingPage.module.css';

const PendingPage = () => {
  return (
    <div className={css['page']}>
      <div className={css['card']}>
        <p className={css['icon']}>⏳</p>
        <h1 className={css['title']}>Waiting for approval</h1>
        <p className={css['text']}>
          Your account is pending approval by an administrator. Please wait.
        </p>
      </div>
    </div>
  );
};

export default PendingPage;
