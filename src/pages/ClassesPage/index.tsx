import { CRUDProvider } from '@/contexts/CRUDContext';
import { ClassesForm } from './ClassesForm';
import { ClassesTable } from './ClassesTable';

export function ClassesPage() {
  return (
    <CRUDProvider endpoint="classes">
      <ClassesTable />
      <ClassesForm />
    </CRUDProvider>
  );
}
