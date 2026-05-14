import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthServiceError } from '../../services/authService';
import { ROUTES } from '../../constants';

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!username.trim()) return '请输入用户名';
    if (!password) return '请输入密码';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      onSuccess();
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.detail);
      } else {
        setError('登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          用户名
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow"
          placeholder="输入用户名"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          密码
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow"
          placeholder="输入密码"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '登录中...' : '登录'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        没有账户？{' '}
        <Link to={ROUTES.register} className="text-purple-600 dark:text-purple-400 hover:underline">
          注册
        </Link>
      </p>
    </form>
  );
}
