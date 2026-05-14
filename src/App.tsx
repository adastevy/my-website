import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import GoalsPage from './pages/GoalsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        {/* Public routes — no Dashboard shell */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — wrapped in Dashboard layout */}
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="recommendations" element={<Navigate to="/overview" replace />} />
          <Route path="trends" element={<Navigate to="/overview" replace />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/studypal">
      <AuthProvider>
        <DashboardProvider>
          <AppContent />
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
