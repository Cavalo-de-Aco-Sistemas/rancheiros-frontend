import { ActionLogsProvider } from '@/hooks/useActionLogs';
import { ActionLogTable } from './ActionLogTable';

export function ActionLogPage() {
  return (
    <ActionLogsProvider>
      <ActionLogTable />
    </ActionLogsProvider>
  );
}
