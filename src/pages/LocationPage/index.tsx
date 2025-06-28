import { CRUDProvider } from '@/contexts/CRUDContext';
import { LocationsForm } from './LocationsForm';
import { LocationsTable } from './LocationsTable';

export function LocationsPage() {
  return (
    <CRUDProvider endpoint="locations">
      <LocationsTable />
      <LocationsForm />
    </CRUDProvider>
  );
}
