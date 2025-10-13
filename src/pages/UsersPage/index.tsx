import { CRUDProvider } from '@/contexts/CRUDContext';
import { UsersForm } from './UsersForm';
import { UsersTable } from './UsersTable';

export function UsersPage() {
  return (
    <CRUDProvider endpoint="users" enableFilters>
      <UsersTable />
      <UsersForm />
    </CRUDProvider>
  );
}
