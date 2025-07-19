import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider.tsx';

import './index.css';

import App from './App.tsx';
import Books from './pages/Books/BooksPage.tsx';
import Lists from './pages/Lists/ListsPage.tsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import Book from './pages/Book/BookPage.tsx';
import MainLayout from './layouts/MainLayout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <App /> },
      { path: 'books', element: <Books /> },
      { path: 'lists', element: <Lists /> },
      { path: 'book/:id', element: <Book /> },
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
