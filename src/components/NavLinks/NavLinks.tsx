import { useMemo } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Divider, Stack } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES_MAP } from '@/pages/MainPage/MainPage';
import classes from './NavLinks.module.css';

export default function NavLinks({ toggleMobile }: { toggleMobile: () => void }) {
  const location = useLocation();
  const { logout, permissions } = useAuth();

  const items = useMemo(
    () =>
      [...ROUTES_MAP.values()].filter(
        (item) => permissions?.[item.entity as keyof typeof permissions]?.read
      ),
    [permissions]
  );

  return (
    <Stack gap="xs" m="sm">
      {items.map((item) => (
        <Link
          className={classes.link}
          data-active={item.link === location.pathname || undefined}
          to={item.link}
          key={item.label}
          onClick={toggleMobile}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </Link>
      ))}
      <Divider />
      <a
        className={classes.link}
        onClick={logout}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && logout()}
      >
        <IconLogout className={classes.linkIcon} stroke={1.5} />
        <span>Sair</span>
      </a>
    </Stack>
  );
}
