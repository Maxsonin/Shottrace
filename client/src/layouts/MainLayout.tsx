import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../index.css';

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
