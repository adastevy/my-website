import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-56 overflow-y-auto min-h-[calc(100vh-4rem)] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
