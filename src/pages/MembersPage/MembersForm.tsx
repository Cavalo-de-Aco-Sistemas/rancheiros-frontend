import { useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Button, Modal, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Member, MemberDto } from '@/model/member';
import useMemberMutation from '@/mutations/useMemberMutation';
import { MemberSelect } from '@/select/MemberSelect';

export const phasesOptions = [
  { label: 'Amigo', value: 'friend' },
  { label: 'Prospect', value: 'prospect' },
  { label: 'Meio-escudo', value: 'halfpatch' },
  { label: 'Full patch', value: 'fullpatch' },
];

export const ranchOptions = [
  { label: 'Cambira-PR', value: 'cambira' },
  { label: 'Medianeira-PR', value: 'medianeira' },
  { label: 'Londrina-PR', value: 'londrina' },
  { label: 'Cornélio Procópio-PR', value: 'cornelio' },
  { label: 'Arapongas-PR', value: 'arapongas' },
  { label: 'Apucarana-PR', value: 'apucarana' },
  { label: 'Faxinal-PR', value: 'faxinal' },
  { label: 'São José dos Pinhais - PR', value: 'sjpinhais' },
  { label: 'Nampula (Moçambique)', value: 'mocambique' },
  { label: 'Guarulhos-SP', value: 'guarulhos' },
  { label: 'Jaguariaíva-PR', value: 'jaguaraiva' },
  { label: 'Maringá-PR', value: 'maringa' },
];

interface MembersFormProps {
  opened: boolean;
  close: () => void;
  selected?: Member;
  action: string;
  membersQuery: UseQueryResult<Member[], Error>;
}

export default function MembersForm(props: MembersFormProps) {
  const { opened, close, selected, action, membersQuery } = props;
  const { refetch } = membersQuery;
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      phase: '',
    } as MemberDto,
  });

  const { mutate, isPending } = useMemberMutation({ action, form, refetch, close, setError });

  const onClose = () => {
    setError('');
    form.reset();
    close();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Cadastro de Membros" size="xl">
      <form onSubmit={form.onSubmit((data) => mutate({ data, id: selected?.id }))}>
        <Stack>
          <TextInput
            required
            label="Nome"
            key={form.key('name')}
            {...form.getInputProps('name')}
            disabled={isPending || action === 'delete'}
          />
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            <TextInput
              label="Nome no Patch"
              key={form.key('patch')}
              {...form.getInputProps('patch')}
              onChange={({ currentTarget }) =>
                form.setFieldValue('patch', currentTarget.value.toLocaleUpperCase())
              }
            />
            <Select
              data={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              label="Tipo sanguíneo"
              key={form.key('blood')}
              {...form.getInputProps('blood')}
              disabled={isPending || action === 'delete'}
            />
            <Select
              data={phasesOptions}
              label="Fase"
              key={form.key('phase')}
              {...form.getInputProps('phase')}
              disabled={isPending || action === 'delete'}
            />
            <DateInput
              label="Nascimento"
              key={form.key('birthday')}
              {...form.getInputProps('birthday')}
              disabled={isPending || action === 'delete'}
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />{' '}
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }}>
            <TextInput
              label="Celular/WhatsApp"
              placeholder="(99) 99999-9999"
              key={form.key('phone')}
              {...form.getInputProps('phone')}
            />
            <MemberSelect
              label="Cônjuge"
              key={form.key('spouse')}
              {...form.getInputProps('spouse')}
            />
            <MemberSelect
              label="Padrinho/Madrinha"
              key={form.key('godfather')}
              {...form.getInputProps('godfather')}
            />
            <TextInput
              label="Encargo"
              key={form.key('responsibility')}
              {...form.getInputProps('responsibility')}
            />
            <Select
              data={ranchOptions}
              label="Rancho"
              key={form.key('ranch')}
              {...form.getInputProps('ranch')}
              disabled={isPending || action === 'delete'}
            />
            <TextInput
              label="Residência"
              placeholder="Cidade-UF"
              key={form.key('residence')}
              {...form.getInputProps('residence')}
              onChange={({ currentTarget }) =>
                form.setFieldValue('residence', currentTarget.value.toLocaleUpperCase())
              }
            />
            <DateInput
              label="Data que prospectou"
              key={form.key('dateProspect')}
              {...form.getInputProps('dateProspect')}
              disabled={isPending || action === 'delete'}
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />
            <DateInput
              label="Data Meio escudo"
              key={form.key('dateHalfPatch')}
              {...form.getInputProps('dateHalfPatch')}
              disabled={isPending || action === 'delete'}
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />
            <DateInput
              label="Data Full patch"
              key={form.key('dateFullPatch')}
              {...form.getInputProps('dateFullPatch')}
              disabled={isPending || action === 'delete'}
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />
          </SimpleGrid>
          {error && (
            <Text c="red" fs="sm" ta="center">
              {error}
            </Text>
          )}
          <Button type="submit" disabled={isPending} color={action === 'delete' ? 'red' : action === 'update' ? 'cyan.9' : 'teal.9'}>
            {action === 'create' ? 'Cadastrar' : action === 'update' ? 'Atualizar' : 'Excluir'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
