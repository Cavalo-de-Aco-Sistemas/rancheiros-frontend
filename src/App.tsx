import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-react-table/styles.css';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './contexts/AuthContext';
import { SharedFiltersProvider } from './contexts/SharedFiltersContext';
import { SharedEnrollmentsProvider } from './hooks/useSharedEnrollments';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <DatesProvider
          settings={{
            locale: 'pt-br',
            firstDayOfWeek: 0,
          }}
        >
          <AuthProvider>
            <SharedEnrollmentsProvider>
              <SharedFiltersProvider>
                <Notifications />
                <Router />
              </SharedFiltersProvider>
            </SharedEnrollmentsProvider>
          </AuthProvider>
        </DatesProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
