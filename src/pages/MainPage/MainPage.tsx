import { Link, Outlet } from 'react-router-dom';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AffixStack from '@/components/AffixStack';
import FetchingLoader from '@/components/FetchingLoader';
import { Logo } from '@/components/Logo';
import NavLinks from '@/components/NavLinks/NavLinks';
import OfflineIndicator from '@/components/OfflineIndicator';

import 'dayjs/locale/pt-br';

export function MainPage() {
  // disclosure to control mobile and desktop navigation menus
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Logo order={3} />
            </Link>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section grow component={ScrollArea}>
          <NavLinks toggleMobile={toggleMobile} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
        <AffixStack>
          <FetchingLoader />
          <OfflineIndicator />
        </AffixStack>
      </AppShell.Main>
    </AppShell>
  );
}
