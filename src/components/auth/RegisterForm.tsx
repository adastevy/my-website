import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthServiceError } from '../../services/authService';
import { ROUTES } from '../../constants';

interface Props {
  onSuccess: () => void;
}

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
}

const USERNAME_RE = /^[a-zA-Z0-9_]{3,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm({ onSuccess }: Props) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!username.trim()) {
      errors.username = '请输入用户名';
    } else if (!USERNAME_RE.test(username.trim())) {
      errors.username = '用户名须为 3-50 字符的字母数字字符串';
    }
    if (!email.trim()) {
      errors.email = '请输入邮箱';
    } else if (email.length > 120 || !EMAIL_RE.test(email.trim())) {
      errors.email = '邮箱格式无效';
    }
    if (!password) {
      errors.password = '请输入密码';
    } else if (password.length < 8) {
      errors.password = '密码须至少 8 字符';
    }
    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setError('');
    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      onSuccess();
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.detail);
      } else {
        setError('注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: keyof FieldErrors) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      fieldErrors[field]
        ? 'border-red-400 dark:border-red-500'
        : 'border-gray-300 dark:border-gray-600'
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          用户名
        </label>
        <input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
          }}
          autoComplete="username"
          className={inputClass('username')}
          placeholder="3-50 字符的字母数字"
        />
        {fieldErrors.username && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          邮箱
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
          }}
          autoComplete="email"
          className={inputClass('email')}
          placeholder="your@email.com"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          密码
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
          }}
          autoComplete="new-password"
          className={inputClass('password')}
          placeholder="至少 8 字符"
        />
        {fieldErrors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '注册中...' : '注册'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        已有账户？{' '}
        <Link to={ROUTES.login} className="text-purple-600 dark:text-purple-400 hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
