import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ActionLogPage } from './pages/ActionLogPage';
import { CallManagementPage } from './pages/CallManagementPage';
import { CertificationManagementPage } from './pages/CertificationPage';
import { ClassesPage } from './pages/ClassesPage';
import { EnrollmentsPage } from './pages/EnrollmentsPage';
import HomePage from './pages/HomePage';
import { LocationsPage } from './pages/LocationPage';
import { MainPage } from './pages/MainPage';
import { MembersPage } from './pages/MembersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RanchesPage } from './pages/RanchesPage';
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
        path: '/inscricoes/visao-geral',
        element: <EnrollmentsPage />,
      },
      {
        path: '/inscricoes/gestao-chamadas',
        element: <CallManagementPage />,
      },
      {
        path: '/inscricoes/certificacoes',
        element: <CertificationManagementPage />,
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
      {
        path: '/log-de-acoes',
        element: <ActionLogPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
