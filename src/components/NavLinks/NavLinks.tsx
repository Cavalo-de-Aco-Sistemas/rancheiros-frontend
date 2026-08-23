import { useMemo, useState } from 'react';
import { IconChevronDown, IconChevronRight, IconMail } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse, Divider, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES_MAP } from '@/pages/MainPage/MainPage';
import { UserMenu } from '@/components/UserMenu';
import classes from './NavLinks.module.css';

export default function NavLinks({ toggleMobile }: { toggleMobile: () => void }) {
  const location = useLocation();
  const { permissions, super_admin } = useAuth();
  const [enrollmentsOpened, setEnrollmentsOpened] = useState(false);

  const items = useMemo(() => {
    return [...ROUTES_MAP.values()].filter((item) => {
      if ('superAdminOnly' in item && item.superAdminOnly) {
        return !!super_admin;
      }

      if (!('entity' in item) || !item.entity) {
        return true;
      }

      // Check basic read permission for the entity
      const hasReadPermission = permissions?.[item.entity as keyof typeof permissions]?.read;
      
      if (!hasReadPermission) {
        return false;
      }
      
      // Gestão de Chamadas and Certificações require flow.update permission
      if (item.link === '/inscricoes/gestao-chamadas' || item.link === '/inscricoes/certificacoes') {
        return permissions?.flow?.update || false;
      }
      
      return true;
    });
  }, [permissions, super_admin]);

  // Separar itens principais dos subitens de inscrições
  const mainItems = useMemo(
    () => items.filter((item) => !item.link.startsWith('/inscricoes/')),
    [items]
  );

  const enrollmentItems = useMemo(
    () => items.filter((item) => item.link.startsWith('/inscricoes/')),
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
              {enrollmentsOpened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
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
      <UserMenu />
    </Stack>
  );
}
