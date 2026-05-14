import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import ParticleCanvas from '../components/Hero/ParticleCanvas';
import RegisterForm from '../components/auth/RegisterForm';
import { ROUTES } from '../constants';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(ROUTES.overview, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="absolute inset-0 opacity-40 dark:opacity-30">
        <ParticleCanvas theme={theme} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to={ROUTES.overview}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            StudyPal
          </Link>
          <p className="mt-2 text-gray-500 dark:text-gray-400">创建你的学习账户</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <RegisterForm onSuccess={() => navigate(ROUTES.overview, { replace: true })} />
        </div>
      </div>
    </div>
  );
}
