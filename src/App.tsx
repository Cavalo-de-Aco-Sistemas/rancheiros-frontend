import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-react-table/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { AuthProvider } from './contexts/AuthContext';
import { Router } from './Router';
import { theme } from './theme';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <DatesProvider
            settings={{
              locale: 'pt-br',
              firstDayOfWeek: 0,
            }}
          >
            <AuthProvider>
              <Notifications />
              <Router />
            </AuthProvider>
          </DatesProvider>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
