import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClassesPage } from './pages/ClassesPage';
import { EnrollmentsPage } from './pages/EnrollmentsPage';
import HomePage from './pages/HomePage';
import { MainPage } from './pages/MainPage';
import { MembersPage } from './pages/MembersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RanchesPage } from './pages/RanchesPage';
import { UsersPage } from './pages/UsersPage';
import { LocationsPage } from './pages/LocationPage';

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
        path: '/inscricoes',
        element: <EnrollmentsPage />,
      },
      {
        path: '/usuarios',
        element: <UsersPage />,
      },
      {
        path: '/ranchos',
        element: <RanchesPage />,
      },
      {
        path: '/locais',
        element: <LocationsPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
