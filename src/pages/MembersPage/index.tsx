import { useMemo, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.cjs';
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Member, MemberDto } from '@/model/member';
import useMemberMutation from '@/mutations/useMemberMutation';
import useMembersQuery from '@/queries/useMembersQuery';
import { MemberSelect } from '@/select/MemberSelect';

interface Option {
  label: string;
  value: string;
}

const optionsToObject = (options: Option[]) => {
  return Object.fromEntries(options.map(({ label, value }) => [value, label]));
};

const phasesOptions = [
  { label: 'Amigo', value: 'friend' },
  { label: 'Prospect', value: 'prospect' },
  { label: 'Meio-escudo', value: 'halfpatch' },
  { label: 'Full patch', value: 'fullpatch' },
];
const phases = optionsToObject(phasesOptions);

const ranchOptions = [
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
const ranchs = optionsToObject(ranchOptions);

const digits = /\d+/g;

export function MembersPage() {
  const { data, isLoading, refetch } = useMembersQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<Member | undefined>();
  const [action, setAction] = useState('create');
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

  const dateBR = (date: string | null) => date?.split('-').reverse().join('/');

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'patch',
        header: 'Nome no Patch',
        Cell: ({ row }) =>
          row.original.patch && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.patch}
            </Badge>
          ),
      },
      {
        accessorKey: 'blood',
        header: 'Tipo sanguíneo',
        Cell: ({ row }) =>
          row.original.blood && (
            <Badge ff="Rye" variant="transparent" color="red.6" radius="xs">
              {row.original.blood}
            </Badge>
          ),
      },
      {
        accessorKey: 'phase',
        header: 'Fase',
        Cell: ({ row }) => phases[row.original.phase ?? ''] ?? '',
      },
      {
        accessorKey: 'birthday',
        header: 'Aniversário',
        Cell: ({ row }) => dateBR(row.original.birthday),
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        Cell: ({ row }) =>
          row.original.phone && (
            <Anchor
              href={
                (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
                  ? 'whatsapp://wa.me/55'
                  : 'https://wa.me/55') + row.original.phone.match(digits)?.join('')
              }
              target="_blank"
              rel="noreferrer"
            >
              {row.original.phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')}
            </Anchor>
          ),
      },
      {
        accessorKey: 'ranch',
        header: 'Rancho',
        Cell: ({ row }) => ranchs[row.original.ranch ?? ''] ?? '',
      },
      { accessorKey: 'residence', header: 'Residência' },
      { accessorKey: 'responsibility', header: 'Encargo' },
      {
        accessorKey: 'dateProspect',
        header: 'Data Prospect',
        Cell: ({ row }) => dateBR(row.original.dateProspect),
      },
      {
        accessorKey: 'dateHalfPatch',
        header: 'Data Meio escudo',
        Cell: ({ row }) => dateBR(row.original.dateHalfPatch),
      },
      {
        accessorKey: 'dateFullPatch',
        header: 'Data Full patch',
        Cell: ({ row }) => dateBR(row.original.dateFullPatch),
      },
      { accessorKey: 'spouse.name', header: 'Cônjuge' },
      { accessorKey: 'godfather.name', header: 'Padrinho' },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    localization: MRT_Localization_PT_BR,
    state: { isLoading },
    mantinePaperProps: {
      style: {
        border: 'none',
      },
    },
    enableBottomToolbar: false,
    enablePagination: false,
    enableRowVirtualization: true,
    mantineTableContainerProps: { style: { maxHeight: 'calc(100vh - 128px)' } },
    renderToolbarInternalActions: ({ table }) => (
      <Group>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <ActionIcon
          onClick={() => {
            setSelected(undefined);
            setAction('create');
            open();
          }}
          variant="transparent"
          color="brand.4"
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
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
              />{' '}
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
            <Button
              type="submit"
              disabled={isPending}
              color={action === 'delete' ? 'red' : 'teal.9'}
            >
              {action === 'create' ? 'Cadastrar' : action === 'update' ? 'Atualizar' : 'Excluir'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
