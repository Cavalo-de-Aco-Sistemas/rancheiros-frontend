import { CRUDProvider } from '@/contexts/CRUDContext';
import { CallManagementTable, CallManagementForm } from './index';

export function CallManagementPage() {
  return (
    <CRUDProvider endpoint="enrollments">
      <CallManagementTable />
      <CallManagementForm />
    </CRUDProvider>
  );
}
