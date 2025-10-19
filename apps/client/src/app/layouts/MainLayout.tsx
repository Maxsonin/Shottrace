import './MainLayout.css';
import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/layout/Navbar';
import { useState } from 'react';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import Footer from '@/shared/components/layout/Footer';

export type OutletContextType = {
  setBackgroundImage: (img: string) => void;
};

const MainLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );

  return (
    <Box
      className="relative"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {backgroundImage && (
        <div
          className="background-img-fade"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          maxWidth: '950px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{ flex: 1, mt: backgroundImage ? '400px' : 0 }}
        >
          <Outlet context={{ setBackgroundImage } as OutletContextType} />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
