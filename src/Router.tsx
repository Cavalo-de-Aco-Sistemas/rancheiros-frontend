import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClassesPage } from './pages/ClassesPage';
import HomePage from './pages/HomePage';
import { MainPage } from './pages/MainPage';
import { MembersPage } from './pages/MembersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UsersPage } from './pages/UsersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      { path: '/membros', element: <MembersPage /> },
      {
        path: '/turmas',
        element: <ClassesPage />,
      },
      {
        path: '/usuarios',
        element: <UsersPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
