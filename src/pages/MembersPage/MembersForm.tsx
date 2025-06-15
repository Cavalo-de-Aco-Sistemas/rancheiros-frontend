import { useMemo } from 'react';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import CRUDForm from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Member, MemberDto } from '@/model/member';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { toDate } from '@/utils/dates';

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

const INITIAL_VALUES = { name: '' };

const parseSelected = (member: Member): MemberDto => {
  const {
    name,
    phase,
    blood,
    patch,
    birthday,
    phone,
    ranch,
    residence,
    responsibility,
    dateProspect,
    dateHalfPatch,
    dateFullPatch,
    spouse,
    godfather,
  } = member;
  return {
    name,
    phase,
    blood,
    patch,
    birthday: toDate(birthday),
    phone,
    ranch,
    residence,
    responsibility,
    dateFullPatch: toDate(dateFullPatch),
    dateHalfPatch: toDate(dateHalfPatch),
    dateProspect: toDate(dateProspect),
    spouse: spouse?.id.toString(),
    godfather: godfather?.id.toString(),
  };
};

export default function MembersForm() {
  const membersQuery = useCRUDQuery<Member>('members');

  const membersOptions = useMemo(
    () => membersQuery.data?.map((member) => ({ label: member.name, value: member.id.toString() })),
    [membersQuery.data]
  );

  const { query, action } = useCRUD();
  const { isPending } = query;

  const form = useForm<MemberDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <CRUDForm<Member, MemberDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="members"
      modalProps={{ title: 'Cadastro de Membros', size: 'xl' }}
      handleError={(error) => {
        if (error.status === 409) {
          return 'O campo cônjuge deve ser único.';
        } else if (error.status === 422) {
          return 'O item não pode ser excluído pois é referenciado por outros itens';
        }
        return undefined;
      }}
    >
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
          disabled={isPending || action === 'delete'}
        />
        <Select
          data={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          label="Tipo sanguíneo"
          key={form.key('blood')}
          {...form.getInputProps('blood')}
          disabled={isPending || action === 'delete'}
          searchable
          clearable
        />
        <Select
          data={phasesOptions}
          label="Fase"
          key={form.key('phase')}
          {...form.getInputProps('phase')}
          disabled={isPending || action === 'delete'}
          searchable
          clearable
        />
        <DateInput
          label="Nascimento"
          key={form.key('birthday')}
          {...form.getInputProps('birthday')}
          disabled={isPending || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }}>
        <TextInput
          label="Celular/WhatsApp"
          placeholder="(99) 99999-9999"
          key={form.key('phone')}
          {...form.getInputProps('phone')}
          disabled={isPending || action === 'delete'}
        />
        <Select
          label="Cônjuge"
          data={membersOptions}
          key={form.key('spouse')}
          {...form.getInputProps('spouse')}
          disabled={isPending || action === 'delete'}
          searchable
          clearable
        />
        <Select
          label="Padrinho/Madrinha"
          data={membersOptions}
          key={form.key('godfather')}
          {...form.getInputProps('godfather')}
          disabled={isPending || action === 'delete'}
          searchable
          clearable
        />
        <TextInput
          label="Encargo"
          key={form.key('responsibility')}
          {...form.getInputProps('responsibility')}
          disabled={isPending || action === 'delete'}
        />
        <Select
          data={ranchOptions}
          label="Rancho"
          key={form.key('ranch')}
          {...form.getInputProps('ranch')}
          disabled={isPending || action === 'delete'}
          searchable
          clearable
        />
        <TextInput
          label="Residência"
          placeholder="Cidade-UF"
          key={form.key('residence')}
          {...form.getInputProps('residence')}
          onChange={({ currentTarget }) =>
            form.setFieldValue('residence', currentTarget.value.toLocaleUpperCase())
          }
          disabled={isPending || action === 'delete'}
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
    </CRUDForm>
  );
}
