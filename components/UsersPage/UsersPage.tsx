'use client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import css from './UsersPage.module.css';

const UsersPage = () => {
  const { users, fetchUsers, approveUser, deleteUser, setRole } =
    useUserStore();

  useUserStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter an email');
      return;
    }
    setLoading(true);
    try {
      await approveUser(email);
      setEmail('');
    } catch {
      setError('User not found or already approved');
    } finally {
      setLoading(false);
    }
  };

  const approvedUsers = users.filter((u) => u.isApproved);

  return (
    <div className={css['page']}>
      <h1 className={css['title']}>Users</h1>

      <div className={css['addBlock']}>
        <h2 className={css['sectionTitle']}>Add User</h2>
        <form className={css['addForm']} onSubmit={handleAdd}>
          <input
            className={css['input']}
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={css['addButton']} type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
        {error && <p className={css['error']}>{error}</p>}
      </div>

      <div className={css['userList']}>
        <h2 className={css['sectionTitle']}>
          Active Users ({approvedUsers.length})
        </h2>
        {approvedUsers.length === 0 && (
          <p className={css['empty']}>No users yet</p>
        )}
        {approvedUsers.map((user) => (
          <div key={user._id} className={css['userCard']}>
            <div className={css['userInfo']}>
              <p className={css['userEmail']}>{user.email}</p>
              <p className={css['userNickname']}>{user.nickname}</p>
            </div>
            <div className={css['userActions']}>
              <select
                className={css['roleSelect']}
                value={user.role}
                onChange={(e) =>
                  setRole(
                    user.email,
                    e.target.value as 'user' | 'worker' | 'admin'
                  )
                }
              >
                <option value="user">User</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className={css['deleteButton']}
                onClick={() => deleteUser(user.email)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
