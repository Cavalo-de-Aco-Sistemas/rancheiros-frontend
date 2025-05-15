import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Member } from '@/model/member';
import useMembersQuery from '@/queries/useMembersQuery';
import MembersForm from './MembersForm';
import { MembersTable } from './MembersTable';

export function MembersPage() {
  const membersQuery = useMembersQuery();
  const [selected, setSelected] = useState<Member | undefined>();
  const [action, setAction] = useState('create');
  const [opened, { open, close }] = useDisclosure(false);

  const membersOptions = useMemo(
    () => membersQuery.data?.map((member) => ({ label: member.name, value: member.id.toString() })),
    [membersQuery.data]
  );

  return (
    <>
      <MembersTable
        membersQuery={membersQuery}
        setSelected={setSelected}
        setAction={setAction}
        open={open}
      />
      <MembersForm
        membersQuery={membersQuery}
        opened={opened}
        close={close}
        selected={selected}
        action={action}
        membersOptions={membersOptions}
      />
    </>
  );
}
