import { useMemo } from 'react';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useQuery } from '@apollo/client';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { MemberSearchSelect } from '@/components/MemberSearchSelect';
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

// Create a Date pinned to UTC noon to avoid DST/offset issues
const buildUTCDate = (year: number, month: number, day: number): Date =>
  new Date(Date.UTC(year, month, day, 12, 0, 0));

// Helper function to extract date from string/Date avoiding timezone shifts
const extractDateFromString = (dateValue: string | Date | null | undefined): Date | null => {
  if (!dateValue) return null;
  
  let year = 0;
  let month = 0;
  let day = 1;
  
  if (typeof dateValue === 'string') {
    // Handle ISO strings (2000-12-01T00:00:00.000Z) - extract date part before T
    if (dateValue.includes('T')) {
      const datePart = dateValue.split('T')[0];
      const [y, m, d] = datePart.split('-').map(Number);
      if (y && m && d) {
        year = y;
        month = m - 1; // Month is 0-indexed
        day = d;
      } else {
        return null;
      }
    }
    // Handle YYYY-MM-DD format
    else if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = dateValue.split('-').map(Number);
      if (y && m && d) {
        year = y;
        month = m - 1; // Month is 0-indexed
        day = d;
      } else {
        return null;
      }
    }
    // Try parsing as Date and extract UTC values
    else {
      const parsedDate = toDate(dateValue);
      if (parsedDate instanceof Date) {
        year = parsedDate.getUTCFullYear();
        month = parsedDate.getUTCMonth();
        day = parsedDate.getUTCDate();
      } else {
        return null;
      }
    }
  } else if (dateValue instanceof Date) {
    // If it's already a Date object, extract UTC values
    year = dateValue.getUTCFullYear();
    month = dateValue.getUTCMonth();
    day = dateValue.getUTCDate();
  } else {
    return null;
  }
  
  // Create date pinned to UTC noon with the extracted values
  return buildUTCDate(year, month, day);
};

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
  
  // Extract dates directly from strings to avoid timezone shifts
  // For birthday, normalize to year 2000
  let normalizedBirthday: Date | null = null;
  const birthdayDate = extractDateFromString(birthday);
  if (birthdayDate) {
    // Normalize to year 2000 using UTC noon
    normalizedBirthday = buildUTCDate(2000, birthdayDate.getUTCMonth(), birthdayDate.getUTCDate());
  }
  
  return {
    name,
    phase,
    blood,
    patch,
    birthday: normalizedBirthday,
    phone,
    ranch: ranch?.id.toString(),
    residence,
    responsibility,
    dateFullPatch: extractDateFromString(dateFullPatch),
    dateHalfPatch: extractDateFromString(dateHalfPatch),
    dateProspect: extractDateFromString(dateProspect),
    spouse: spouse?.id.toString(),
    godfather: godfather?.id.toString(),
  };
};

// Transform data before submission to normalize birthday to year 2000
// Convert Date objects to strings using fixed timezone (GMT-3) for backend
const transformData = (data: MemberDto): any => {
  // Use any here because we convert Date -> string for GraphQL input
  const transformed: any = { ...data };
  
  const TZ_OFFSET_MINUTES = 180; // GMT-3
  const formatDateInGMT3 = (date: Date, forceYear?: number): string => {
    // Shift date to target timezone before extracting parts
    const shifted = new Date(date.getTime() - TZ_OFFSET_MINUTES * 60 * 1000);
    const year = forceYear ?? shifted.getUTCFullYear();
    const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
    const day = String(shifted.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00-03:00`;
  };
  
  // Normalize birthday to year 2000 and convert to string (UTC)
  if (transformed.birthday instanceof Date) {
    const normalizedDate = buildUTCDate(2000, transformed.birthday.getUTCMonth(), transformed.birthday.getUTCDate());
    transformed.birthday = formatDateInGMT3(normalizedDate, 2000);
  }
  
  // Convert other date fields to YYYY-MM-DD strings (UTC)
  if (transformed.dateProspect instanceof Date) {
    transformed.dateProspect = formatDateInGMT3(transformed.dateProspect);
  }
  
  if (transformed.dateHalfPatch instanceof Date) {
    transformed.dateHalfPatch = formatDateInGMT3(transformed.dateHalfPatch);
  }
  
  if (transformed.dateFullPatch instanceof Date) {
    transformed.dateFullPatch = formatDateInGMT3(transformed.dateFullPatch);
  }
  
  return transformed;
};

export default function MembersForm() {
  const { query, action } = useGraphQLCRUD();

  const { data: ranchesData } = useQuery(GET_RANCHES);

  const ranchesOptions = useMemo(() => {
    const ranches = ranchesData?.ranches || [];
    return ranches
      .filter((ranch: Ranch | null | undefined): ranch is Ranch => !!ranch && !!ranch.id)
      .map((ranch: Ranch) => ({ label: ranch.name, value: ranch.id.toString() }));
  }, [ranchesData]);

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
      transformData={transformData}
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
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM"
          placeholder="DD/MM"
          value={
            form.values.birthday && form.values.birthday instanceof Date
              ? form.values.birthday
              : null
          }
          onChange={(date) => {
            // Always set year to 2000 when date is selected
            if (date instanceof Date) {
              const month = date.getMonth();
              const day = date.getDate();
              const normalizedDate = buildUTCDate(2000, month, day);
              form.setFieldValue('birthday', normalizedDate);
            } else {
              form.setFieldValue('birthday', null);
            }
          }}
          dateParser={(input) => {
            // Parse DD/MM format and add year 2000
            const match = input.match(/^(\d{1,2})\/(\d{1,2})$/);
            if (match) {
              const day = parseInt(match[1], 10);
              const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
              if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
                return new Date(2000, month, day);
              }
            }
            return null;
          }}
          defaultDate={new Date(2000, 0, 1)}
          hideOutsideDates
          maxDate={new Date(2000, 11, 31)}
          minDate={new Date(2000, 0, 1)}
        />
        <TextInput
          label="Celular/WhatsApp"
          placeholder="(99) 99999-9999"
          key={form.key('phone')}
          {...form.getInputProps('phone')}
          disabled={query.isLoading || action === 'delete'}
        />
        <MemberSearchSelect
          label="Cônjuge"
          key={form.key('spouse')}
          {...form.getInputProps('spouse')}
          disabled={query.isLoading || action === 'delete'}
          clearable
        />
        <MemberSearchSelect
          label="Padrinho/Madrinha"
          key={form.key('godfather')}
          {...form.getInputProps('godfather')}
          disabled={query.isLoading || action === 'delete'}
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
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateProspect && form.values.dateProspect instanceof Date
              ? form.values.dateProspect
              : null
          }
          onChange={(date) => {
            // Preserve the date as selected by extracting year, month, day using local methods
            if (date instanceof Date) {
              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              const preservedDate = buildUTCDate(year, month, day);
              form.setFieldValue('dateProspect', preservedDate);
            } else {
              form.setFieldValue('dateProspect', null);
            }
          }}
        />
        <DateInput
          label="Data Meio escudo"
          key={form.key('dateHalfPatch')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateHalfPatch && form.values.dateHalfPatch instanceof Date
              ? form.values.dateHalfPatch
              : null
          }
          onChange={(date) => {
            // Preserve the date as selected by extracting year, month, day using local methods
            if (date instanceof Date) {
              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              const preservedDate = buildUTCDate(year, month, day);
              form.setFieldValue('dateHalfPatch', preservedDate);
            } else {
              form.setFieldValue('dateHalfPatch', null);
            }
          }}
        />
        <DateInput
          label="Data Full patch"
          key={form.key('dateFullPatch')}
          disabled={query.isLoading || action === 'delete'}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/AAAA"
          value={
            form.values.dateFullPatch && form.values.dateFullPatch instanceof Date
              ? form.values.dateFullPatch
              : null
          }
          onChange={(date) => {
            // Preserve the date as selected by extracting year, month, day using local methods
            if (date instanceof Date) {
              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              const preservedDate = buildUTCDate(year, month, day);
              form.setFieldValue('dateFullPatch', preservedDate);
            } else {
              form.setFieldValue('dateFullPatch', null);
            }
          }}
        />
      </SimpleGrid>
    </GraphQLCRUDForm>
  );
}
