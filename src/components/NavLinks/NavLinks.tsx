import { useMemo, useState } from 'react';
import { IconLogout, IconChevronDown, IconChevronRight, IconMail } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Divider, Stack, Collapse, UnstyledButton, Group, Text } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES_MAP } from '@/pages/MainPage/MainPage';
import classes from './NavLinks.module.css';

export default function NavLinks({ toggleMobile }: { toggleMobile: () => void }) {
  const location = useLocation();
  const { logout, permissions } = useAuth();
  const [enrollmentsOpened, setEnrollmentsOpened] = useState(false);

  const items = useMemo(
    () =>
      [...ROUTES_MAP.values()].filter(
        (item) => permissions?.[item.entity as keyof typeof permissions]?.read
      ),
    [permissions]
  );

  // Separar itens principais dos subitens de inscrições
  const mainItems = useMemo(
    () => items.filter(item => !item.link.startsWith('/inscricoes/')),
    [items]
  );

  const enrollmentItems = useMemo(
    () => items.filter(item => item.link.startsWith('/inscricoes/')),
    [items]
  );

  const isEnrollmentActive = useMemo(
    () => location.pathname.startsWith('/inscricoes'),
    [location.pathname]
  );

  return (
    <Stack gap="xs" m="sm">
      {mainItems.map((item) => (
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
      
      {/* Menu hierárquico para Inscrições */}
      {enrollmentItems.length > 0 && (
        <>
          <UnstyledButton
            className={classes.link}
            data-active={isEnrollmentActive || undefined}
            onClick={() => setEnrollmentsOpened((o) => !o)}
          >
            <Group gap="xs">
              <IconMail className={classes.linkIcon} stroke={1.5} />
              <Text>Inscrições</Text>
              {enrollmentsOpened ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}
            </Group>
          </UnstyledButton>
          
          <Collapse in={enrollmentsOpened}>
            <Stack gap="xs" pl="md">
              {enrollmentItems.map((item) => (
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
            </Stack>
          </Collapse>
        </>
      )}
      
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
