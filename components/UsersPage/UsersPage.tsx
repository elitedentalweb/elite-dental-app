'use client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { sendInvite } from '@/services/invites';
import css from './UsersPage.module.css';

const UsersPage = () => {
  const { users, fetchUsers, approveUser, deleteUser, setRole } =
    useUserStore();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    if (!inviteEmail) {
      setInviteError('Please enter an email');
      return;
    }
    setInviteLoading(true);
    try {
      await sendInvite(inviteEmail);
      setInviteSuccess('Invite sent successfully!');
      setInviteEmail('');
    } catch {
      setInviteError('Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className={css['page']}>
      <h1 className={css['title']}>Users</h1>

      <div className={css['addBlock']}>
        <h2 className={css['sectionTitle']}>Invite User</h2>
        <form className={css['addForm']} onSubmit={handleInvite}>
          <input
            className={css['input']}
            type="email"
            placeholder="Enter user email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            className={css['addButton']}
            type="submit"
            disabled={inviteLoading}
          >
            {inviteLoading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {inviteError && <p className={css['error']}>{inviteError}</p>}
        {inviteSuccess && <p className={css['success']}>{inviteSuccess}</p>}
      </div>

      <div className={css['userList']}>
        <h2 className={css['sectionTitle']}>All Users ({users.length})</h2>
        {users.length === 0 && <p className={css['empty']}>No users yet</p>}
        {users.map((user) => (
          <div key={user._id} className={css['userCard']}>
            <div className={css['userInfo']}>
              <p className={css['userEmail']}>{user.email}</p>
              <p className={css['userNickname']}>{user.nickname}</p>
              <p
                className={css['status']}
                style={{ color: user.isApproved ? '#22c55e' : '#f59e0b' }}
              >
                {user.isApproved ? '● Approved' : '● Pending'}
              </p>
            </div>
            <div className={css['userActions']}>
              {!user.isApproved && (
                <button
                  className={css['approveButton']}
                  onClick={() => approveUser(user.email)}
                >
                  Approve
                </button>
              )}
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
