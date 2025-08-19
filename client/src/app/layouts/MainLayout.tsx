import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/layout/Navbar';

const MainLayout = () => {
  return (
    <div className="main-content">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
