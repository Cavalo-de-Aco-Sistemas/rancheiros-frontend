import { useMemo } from 'react';
import { IconIdBadge2, IconLogout, IconSchool, IconShieldLock } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Divider, Stack } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { PROTECTED_ROUTES } from '@/pages/MainPage/MainPage';
import classes from './NavLinks.module.css';

const ITEMS = [
  { link: '/members', label: 'Membros', icon: IconIdBadge2 },
  { link: '/classes', label: 'Turmas', icon: IconSchool },
  { link: '/usuarios', label: 'Usuários', icon: IconShieldLock },
];

export default function NavLinks({ toggleMobile }: { toggleMobile: () => void }) {
  const location = useLocation();
  const { logout, admin } = useAuth();

  const items = useMemo(() => {
    return ITEMS.filter((item) => {
      if (PROTECTED_ROUTES.includes(item.link)) {
        return admin;
      }
      return true;
    });
  }, [admin]);

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
