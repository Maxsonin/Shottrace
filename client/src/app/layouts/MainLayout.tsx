import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/layout/Navbar';
import { useState } from 'react';

export type OutletContextType = {
  setBackgroundImage: (img: string) => void;
};

const MainLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="relative min-h-screen">
      {backgroundImage && (
        <div
          className="background-img-fade"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-[950px] mx-auto px-0">
        <Navbar />
        <main>
          <Outlet context={{ setBackgroundImage } as OutletContextType} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
