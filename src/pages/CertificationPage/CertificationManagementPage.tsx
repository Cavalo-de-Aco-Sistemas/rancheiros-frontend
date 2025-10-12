import { CRUDProvider } from '@/contexts/CRUDContext';
import { CertificationManagementTable, CertificationManagementForm } from './index';

export function CertificationManagementPage() {
  return (
    <CRUDProvider endpoint="enrollments">
      <CertificationManagementTable />
      <CertificationManagementForm />
    </CRUDProvider>
  );
}
