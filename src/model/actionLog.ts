export type ActionLogAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface ActionLog {
  id: string;
  entity_name: string;
  entity_id: string;
  action: ActionLogAction;
  changes: Record<string, any> | null;
  created_at: string;
  actor: {
    id: string;
    username: string;
    name: string;
  } | null;
}
