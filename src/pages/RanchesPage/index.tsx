import { CRUDProvider } from '@/contexts/CRUDContext';
import { RanchesForm } from './RanchesForm';
import { RanchesTable } from './RanchesTable';

export function RanchesPage() {
  return (
    <CRUDProvider endpoint="ranches">
      <RanchesTable />
      <RanchesForm />
    </CRUDProvider>
  );
}
