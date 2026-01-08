import { useState, useMemo, useEffect } from 'react';
import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@apollo/client';
import { GET_MEMBERS, GET_MEMBER } from '@/graphql/members';
import { Member } from '@/model/member';

interface MemberSearchSelectProps extends Omit<SelectProps, 'data' | 'searchable'> {
  value?: string | null;
  onChange?: (value: string | null) => void;
}

/**
 * Componente de busca de membros com busca assíncrona no backend
 * 
 * Permite ao usuário digitar e buscar membros no banco de dados,
 * usando debounce para evitar muitas requisições.
 * 
 * @example
 * ```tsx
 * <MemberSearchSelect
 *   label="Cônjuge"
 *   value={form.values.spouse}
 *   onChange={(value) => form.setFieldValue('spouse', value)}
 *   disabled={isLoading}
 *   clearable
 * />
 * ```
 */
export function MemberSearchSelect({
  value,
  onChange,
  disabled,
  ...selectProps
}: MemberSearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  // Query para buscar membros com filtro de nome
  const { data, loading } = useQuery(GET_MEMBERS, {
    variables: {
      pagination: {
        limit: 50,
        page: 1,
        columnFilters: debouncedSearchTerm
          ? [
              {
                id: 'name',
                value: debouncedSearchTerm,
                filterFn: 'contains',
              },
            ]
          : undefined,
        sortBy: 'name',
        sortOrder: 'ASC',
      },
    },
    skip: false, // Sempre executar, mesmo sem termo de busca
  });

  // Converter membros para opções do Select
  const membersOptions = useMemo(() => {
    const members = (data?.members?.data || []) as Member[];
    return members.map((member: Member) => ({
      label: member.name,
      value: member.id.toString(),
    }));
  }, [data]);

  // Verificar se o membro selecionado está na lista atual
  const selectedMemberInList = useMemo(() => {
    if (!value) return false;
    const members = (data?.members?.data || []) as Member[];
    return members.some((m) => m.id.toString() === value);
  }, [value, data]);

  // Se há um valor selecionado mas não está na lista, buscar individualmente
  const { data: selectedMemberData, loading: loadingSelected } = useQuery(GET_MEMBER, {
    variables: { id: value! },
    skip: !value || selectedMemberInList, // Pular se não há valor ou já está na lista
  });

  // Combinar opções: membros da busca + membro selecionado (se não estiver na lista)
  const allOptions = useMemo(() => {
    const options = [...membersOptions];
    
    // Se há um membro selecionado que não está na lista, adicionar
    if (value && !selectedMemberInList && selectedMemberData?.member) {
      const member = selectedMemberData.member as Member;
      const exists = options.some((opt) => opt.value === member.id.toString());
      if (!exists) {
        options.unshift({
          label: member.name,
          value: member.id.toString(),
        });
      }
    }
    
    return options;
  }, [membersOptions, value, selectedMemberInList, selectedMemberData]);

  // Limpar termo de busca quando o valor muda externamente
  useEffect(() => {
    if (!value) {
      setSearchTerm('');
    }
  }, [value]);

  const isLoading = loading || loadingSelected;

  return (
    <Select
      {...selectProps}
      data={allOptions}
      value={value || null}
      onChange={onChange}
      disabled={disabled}
      searchable
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      placeholder={isLoading ? 'Buscando...' : selectProps.placeholder || 'Digite para buscar'}
      nothingFoundMessage={
        isLoading
          ? 'Buscando membros...'
          : debouncedSearchTerm
            ? 'Nenhum membro encontrado'
            : 'Digite para buscar membros'
      }
    />
  );
}
