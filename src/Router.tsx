import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClassesPage } from './pages/ClassesPage';
import { MainPage } from './pages/MainPage';
import { MembersPage } from './pages/MembersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UsersPage } from './pages/UsersPage';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      { path: '/members', element: <MembersPage /> },
      {
        path: '/classes',
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
