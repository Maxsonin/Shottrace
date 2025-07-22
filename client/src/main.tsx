import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider.tsx';

import './index.css';

import HomePage from './pages/Home/HomePage.tsx';
import MoviesPage from './pages/Movies/MoviesPage.tsx';
import Lists from './pages/Lists/ListsPage.tsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import MoviePage from './pages/Movie/MoviePage.tsx';
import MainLayout from './layouts/MainLayout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'lists', element: <Lists /> },
      { path: 'movie/:id', element: <MoviePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
);
