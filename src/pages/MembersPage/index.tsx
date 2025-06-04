import { CRUDProvider } from '@/contexts/CRUDContext';
import MembersForm from './MembersForm';
import { MembersTable } from './MembersTable';

export function MembersPage() {
  return (
    <CRUDProvider endpoint="members">
      <MembersTable />
      <MembersForm />
    </CRUDProvider>
  );
}
