import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { MembersPage } from './pages/MembersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UsersPage } from './pages/UsersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      { path: '/', element: <MembersPage /> },
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
