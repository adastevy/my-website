import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    logout();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full max-w-md mx-auto block py-2.5 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '退出中...' : '退出登录'}
    </button>
  );
}
