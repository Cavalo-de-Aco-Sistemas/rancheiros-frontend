import { CRUDProvider } from '@/contexts/CRUDContext';
import { EnrollmentsForm } from './EnrollmentsForm';
import { EnrollmentsTable } from './EnrollmentsTable';

export function EnrollmentsPage() {
  return (
    <CRUDProvider endpoint="enrollments">
      <EnrollmentsTable />
      <EnrollmentsForm />
    </CRUDProvider>
  );
}
