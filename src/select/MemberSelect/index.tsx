import { useMemo } from 'react';
import { Select, SelectProps } from '@mantine/core';
import useMembersQuery from '@/queries/useMembersQuery';

interface MemberSelectProps extends SelectProps {}

export function MemberSelect(props: MemberSelectProps) {
  const { data } = useMembersQuery();

  const options = useMemo(
    () => data?.map((member) => ({ label: member.name, value: member.id.toString() })),
    [data]
  );

  return <Select {...props} data={options ?? []} />;
}
