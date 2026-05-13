import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { DashboardProvider } from './context/DashboardContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import Dashboard from './components/Dashboard/Dashboard';
import OverviewPage from './pages/OverviewPage';
import RecommendationsPage from './pages/RecommendationsPage';
import TrendsPage from './pages/TrendsPage';
import GoalsPage from './pages/GoalsPage';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <DashboardProvider>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route element={<Dashboard />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="trends" element={<TrendsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
