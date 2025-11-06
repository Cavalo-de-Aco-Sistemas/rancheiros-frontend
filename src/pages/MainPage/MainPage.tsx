import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { useDisclosure, useMounted } from '@mantine/hooks';
import AffixStack from '@/components/AffixStack';
import { Logo } from '@/components/Logo';
import NavLinks from '@/components/NavLinks/NavLinks';
import OfflineIndicator from '@/components/OfflineIndicator';

import 'dayjs/locale/pt-br';

import { useMemo } from 'react';
import {
  IconHome,
  IconIdBadge2,
  IconMail,
  IconMapPin,
  IconSchool,
  IconShieldLock,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const ROUTES_MAP = new Map([
  ['/membros', { link: '/membros', label: 'Membros', icon: IconIdBadge2, entity: 'members' }],
  ['/ranchos', { link: '/ranchos', label: 'Ranchos', icon: IconHome, entity: 'ranches' }],
  [
    '/inscricoes/visao-geral',
    {
      link: '/inscricoes/visao-geral',
      label: 'Visão Geral',
      icon: IconMail,
      entity: 'enrollments',
    },
  ],
  [
    '/inscricoes/gestao-chamadas',
    {
      link: '/inscricoes/gestao-chamadas',
      label: 'Gestão de Chamadas',
      icon: IconMail,
      entity: 'enrollments',
    },
  ],
  [
    '/inscricoes/certificacoes',
    {
      link: '/inscricoes/certificacoes',
      label: 'Certificações',
      icon: IconMail,
      entity: 'enrollments',
    },
  ],
  ['/turmas', { link: '/turmas', label: 'Turmas', icon: IconSchool, entity: 'classes' }],
  [
    '/locais',
    { link: '/locais', label: 'Locais de Treinamento', icon: IconMapPin, entity: 'locations' },
  ],
  ['/usuarios', { link: '/usuarios', label: 'Usuários', icon: IconShieldLock, entity: 'users' }],
]);

export function MainPage() {
  // disclosure to control mobile and desktop navigation menus
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const mounted = useMounted();

  const { permissions } = useAuth();
  const location = useLocation();

  const hasPermission = useMemo(
    () =>
      !ROUTES_MAP.has(location.pathname) ||
      permissions?.[ROUTES_MAP.get(location.pathname)?.entity as keyof typeof permissions]?.read,
    [permissions, location.pathname]
  );

  if (!mounted) {
    return (
      <LoadingOverlay
        visible
        overlayProps={{ blur: 2 }}
        loaderProps={{ type: 'dots', size: 'xl' }}
      />
    );
  }

  if (!hasPermission) {
    return <NotFoundPage />;
  }

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
              <Logo order={2} />
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
          <OfflineIndicator />
        </AffixStack>
      </AppShell.Main>
    </AppShell>
  );
}
