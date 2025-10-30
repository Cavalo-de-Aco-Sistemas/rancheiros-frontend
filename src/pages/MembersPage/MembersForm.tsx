import { useMemo } from 'react';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useQuery } from '@apollo/client';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_MEMBER, DELETE_MEMBER, GET_MEMBERS, UPDATE_MEMBER } from '@/graphql/members';
import { GET_RANCHES } from '@/graphql/ranches';
import { Member, MemberDto } from '@/model/member';
import { Ranch } from '@/model/ranch';
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
    ranch: ranch?.id.toString(),
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
  const { query, action } = useGraphQLCRUD();
  const { ranches: authRanches, super_admin } = useAuth();
  
  // Query all ranches (for super_admin) or use auth ranches (for regular users)
  const { data: ranchesData } = useQuery(GET_RANCHES, {
    skip: !super_admin, // Only query if super_admin
  });

  const members = (query.data || []) as Member[];

  const membersOptions = useMemo(
    () =>
      members.map((member: Member) => ({
        label: member.name,
        value: member.id.toString(),
      })),
    [members]
  );

  const ranchesOptions = useMemo(() => {
    // For super_admin, use all ranches from query; for regular users, use from auth
    const sourceRanches = super_admin 
      ? (ranchesData?.ranches || [])
      : (authRanches || []);
    
    if (!sourceRanches || sourceRanches.length === 0) {
      return [];
    }
    
    const options = sourceRanches
      .filter((ranch: Ranch | null | undefined): ranch is Ranch => !!ranch && !!ranch.id)
      .map((ranch: Ranch) => ({ label: ranch.name, value: ranch.id.toString() }));
    
    return options;
  }, [super_admin, authRanches, ranchesData]);

  const form = useForm<MemberDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <GraphQLCRUDForm<Member, MemberDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_MEMBER}
      updateMutation={UPDATE_MEMBER}
      deleteMutation={DELETE_MEMBER}
      refetchQueries={[{ query: GET_MEMBERS }]}
      modalProps={{ title: 'Cadastro de Membros', size: 'xl' }}
      entityName="Membro"
      handleError={(error) => {
        const message = error.message.toLowerCase();
        if (message.includes('unique') || message.includes('duplicate')) {
          return 'O campo cônjuge deve ser único.';
        } else if (message.includes('foreign key') || message.includes('referenced')) {
          return 'O item não pode ser excluído pois é referenciado por outros itens';
        }
        return undefined;
      }}
    >
      <SimpleGrid cols={{ base: 1, xs: 2 }}>
        <TextInput
          required
          label="Nome"
          key={form.key('name')}
          {...form.getInputProps('name')}
          disabled={query.isLoading || action === 'delete'}
        />
        <Select
          required
          label="Rancho"
          data={ranchesOptions}
          key={form.key('ranch')}
          {...form.getInputProps('ranch')}
          disabled={query.isLoading || action === 'delete'}
          searchable
          clearable
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }}>
        <TextInput
          label="Nome no Patch"
          key={form.key('patch')}
          {...form.getInputProps('patch')}
          onChange={({ currentTarget }) =>
            form.setFieldValue('patch', currentTarget.value.toLocaleUpperCase())
          }
          disabled={query.isLoading || action === 'delete'}
        />
        <Select
          data={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          label="Tipo sanguíneo"
          key={form.key('blood')}
          {...form.getInputProps('blood')}
          disabled={query.isLoading || action === 'delete'}
          searchable
          clearable
        />
        <Select
          data={phasesOptions}
          label="Fase"
          key={form.key('phase')}
          {...form.getInputProps('phase')}
          disabled={query.isLoading || action === 'delete'}
          searchable
          clearable
        />
        <DateInput
          label="Nascimento"
          key={form.key('birthday')}
          {...form.getInputProps('birthday')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.birthday && form.values.birthday instanceof Date
              ? form.values.birthday
              : null
          }
        />
        <TextInput
          label="Celular/WhatsApp"
          placeholder="(99) 99999-9999"
          key={form.key('phone')}
          {...form.getInputProps('phone')}
          disabled={query.isLoading || action === 'delete'}
        />
        <Select
          label="Cônjuge"
          data={membersOptions}
          key={form.key('spouse')}
          {...form.getInputProps('spouse')}
          disabled={query.isLoading || action === 'delete'}
          searchable
          clearable
        />
        <Select
          label="Padrinho/Madrinha"
          data={membersOptions}
          key={form.key('godfather')}
          {...form.getInputProps('godfather')}
          disabled={query.isLoading || action === 'delete'}
          searchable
          clearable
        />
        <TextInput
          label="Encargo"
          key={form.key('responsibility')}
          {...form.getInputProps('responsibility')}
          disabled={query.isLoading || action === 'delete'}
        />
        <TextInput
          label="Residência"
          placeholder="Cidade-UF"
          key={form.key('residence')}
          {...form.getInputProps('residence')}
          onChange={({ currentTarget }) =>
            form.setFieldValue('residence', currentTarget.value.toLocaleUpperCase())
          }
          disabled={query.isLoading || action === 'delete'}
        />
        <DateInput
          label="Data que prospectou"
          key={form.key('dateProspect')}
          {...form.getInputProps('dateProspect')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateProspect && form.values.dateProspect instanceof Date
              ? form.values.dateProspect
              : null
          }
        />
        <DateInput
          label="Data Meio escudo"
          key={form.key('dateHalfPatch')}
          {...form.getInputProps('dateHalfPatch')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateHalfPatch && form.values.dateHalfPatch instanceof Date
              ? form.values.dateHalfPatch
              : null
          }
        />
        <DateInput
          label="Data Full patch"
          key={form.key('dateFullPatch')}
          {...form.getInputProps('dateFullPatch')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateFullPatch && form.values.dateFullPatch instanceof Date
              ? form.values.dateFullPatch
              : null
          }
        />
      </SimpleGrid>
    </GraphQLCRUDForm>
  );
}
