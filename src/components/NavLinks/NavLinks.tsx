import { IconIdBadge2, IconLogout, IconShieldLock } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Divider, Stack } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import classes from './NavLinks.module.css';

export default function NavLinks({ toggleMobile }: { toggleMobile: () => void }) {
  const location = useLocation();
  const { logout } = useAuth();

  const items = [
    { link: '/', label: 'Membros', icon: IconIdBadge2 },
    { link: '/usuarios', label: 'Usuários', icon: IconShieldLock },
  ];

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
