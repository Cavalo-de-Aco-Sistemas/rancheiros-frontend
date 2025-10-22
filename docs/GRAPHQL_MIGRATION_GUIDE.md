# GraphQL Migration Guide - Frontend

## 📋 Status da Migração

### ✅ Completo
- **Apollo Client Setup**: Configurado com autenticação JWT
- **GraphQL Operations**: Todas criadas em `/src/graphql/`
- **AuthContext**: Migrado para usar Apollo Client
- **Custom Hooks**: Atualizados para GraphQL
  - `useGraphQLQuery` - Wrapper genérico para queries
  - `useGraphQLMutation` - Wrapper genérico para mutations
  - `useLoginMutation` - Login com GraphQL
  - `useClassToggleActiveMutation` - Toggle de turma ativa
  - `useEnrollmentFlowMutation` - Mudança de status de inscrição
  - `useEnrollmentAssignClassMutation` - Atribuir turma
  - `useConfirmedEnrollmentsQuery` - Buscar inscrições confirmadas

### 🔄 Pendente
- Atualizar páginas para usar GraphQL
- Remover hooks legados (`useCRUDQuery`, `useCRUDMutation`)
- Remover `axios` e dependências REST

---

## 🔄 Guia de Migração de Componentes

### Padrão Antigo (REST + React Query)

```typescript
import useCRUDQuery from '@/queries/useCRUDQuery';
import useCRUDMutation from '@/mutations/useCRUDMutation';
import { BACKEND_ADDRESS } from '@/utils/constants';

// Query
const { data, isLoading, refetch } = useCRUDQuery<Member[]>('members');

// Mutation
const mutation = useCRUDMutation({
  action: 'create',
  form,
  refetch,
  close,
  setError,
  endpoint: 'members',
});
```

### Novo Padrão (GraphQL + Apollo Client)

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GET_MEMBERS, CREATE_MEMBER } from '@/graphql/members';

// Query
const { data, loading, refetch } = useQuery(GET_MEMBERS);
const members = data?.members || [];

// Mutation
const [createMember, { loading: creating }] = useMutation(CREATE_MEMBER, {
  onCompleted: () => {
    form.reset();
    setError('');
    refetch();
    close();
  },
  onError: (error) => {
    setError(error.message);
  },
});

// Chamar mutation
createMember({ variables: { input: form.values } });
```

---

## 📦 Operações GraphQL Disponíveis

### Auth (`/src/graphql/auth.ts`)
- `LOGIN_MUTATION` - Login de usuário

### Members (`/src/graphql/members.ts`)
- `GET_MEMBERS` - Listar membros
- `GET_MEMBER` - Buscar membro por ID
- `CREATE_MEMBER` - Criar membro
- `UPDATE_MEMBER` - Atualizar membro
- `DELETE_MEMBER` - Deletar membro (soft delete)

### Classes (`/src/graphql/classes.ts`)
- `GET_CLASSES` - Listar turmas
- `GET_CLASS` - Buscar turma por ID
- `CREATE_CLASS` - Criar turma
- `UPDATE_CLASS` - Atualizar turma (inclui toggle active)
- `DELETE_CLASS` - Deletar turma

### Enrollments (`/src/graphql/enrollments.ts`)
- `GET_ENROLLMENTS` - Listar inscrições (com paginação e filtros)
- `GET_ENROLLMENT` - Buscar inscrição por ID
- `GET_CONFIRMED_ENROLLMENTS_BY_CLASS` - Buscar inscrições confirmadas de uma turma
- `CREATE_PUBLIC_ENROLLMENT` - Criar inscrição pública (formulário)
- `CREATE_ENROLLMENT` - Criar inscrição (admin)
- `UPDATE_ENROLLMENT` - Atualizar inscrição
- `UPDATE_ENROLLMENT_STATUS` - Atualizar status da inscrição
- `ASSIGN_CLASS_TO_ENROLLMENT` - Atribuir turma à inscrição
- `DELETE_ENROLLMENT` - Deletar inscrição

### Locations (`/src/graphql/locations.ts`)
- `GET_LOCATIONS` - Listar locais
- `GET_LOCATION` - Buscar local por ID
- `GET_PUBLIC_CITIES` - Buscar cidades públicas (sem autenticação)
- `CREATE_LOCATION` - Criar local
- `UPDATE_LOCATION` - Atualizar local
- `DELETE_LOCATION` - Deletar local

### Ranches (`/src/graphql/ranches.ts`)
- `GET_RANCHES` - Listar ranchos
- `GET_RANCH` - Buscar rancho por ID
- `CREATE_RANCH` - Criar rancho
- `UPDATE_RANCH` - Atualizar rancho
- `DELETE_RANCH` - Deletar rancho

### Users (`/src/graphql/users.ts`)
- `GET_USERS` - Listar usuários
- `GET_USER` - Buscar usuário por ID
- `CREATE_USER` - Criar usuário
- `UPDATE_USER` - Atualizar usuário
- `DELETE_USER` - Deletar usuário
- `CHANGE_PASSWORD` - Trocar senha do usuário

---

## 🎯 Exemplos de Migração por Componente

### 1. Lista Simples (sem paginação)

**Antes:**
```typescript
const { data, isLoading, refetch } = useCRUDQuery<Member[]>('members');
```

**Depois:**
```typescript
import { useQuery } from '@apollo/client';
import { GET_MEMBERS } from '@/graphql/members';

const { data, loading, refetch } = useQuery(GET_MEMBERS);
const members = data?.members || [];
```

### 2. Lista com Paginação

**Antes:**
```typescript
const { data, isLoading, refetch } = useCRUDQuery<PaginatedResult<Enrollment>>(
  'enrollments',
  {
    page: 1,
    limit: 50,
    status: 'waiting',
    search: 'João'
  },
  { usePagination: true }
);
```

**Depois:**
```typescript
import { useQuery } from '@apollo/client';
import { GET_ENROLLMENTS } from '@/graphql/enrollments';

const { data, loading, refetch } = useQuery(GET_ENROLLMENTS, {
  variables: {
    pagination: {
      page: 1,
      limit: 50,
      search: 'João',
    },
    status: 'waiting',
  },
});

const enrollments = data?.enrollments?.data || [];
const total = data?.enrollments?.total || 0;
const totalPages = data?.enrollments?.totalPages || 0;
```

### 3. Create Mutation

**Antes:**
```typescript
const mutation = useCRUDMutation({
  action: 'create',
  form,
  refetch,
  close,
  setError,
  endpoint: 'members',
});

// Chamada
mutation.mutate({ data: form.values });
```

**Depois:**
```typescript
import { useMutation } from '@apollo/client';
import { CREATE_MEMBER, GET_MEMBERS } from '@/graphql/members';

const [createMember, { loading }] = useMutation(CREATE_MEMBER, {
  onCompleted: () => {
    form.reset();
    setError('');
    refetch();
    close();
  },
  onError: (error) => {
    setError(error.message);
  },
  refetchQueries: [{ query: GET_MEMBERS }],
});

// Chamada
createMember({ variables: { input: form.values } });
```

### 4. Update Mutation

**Antes:**
```typescript
const mutation = useCRUDMutation({
  action: 'update',
  form,
  refetch,
  close,
  setError,
  endpoint: 'members',
});

// Chamada
mutation.mutate({ data: form.values, id: selectedMember.id });
```

**Depois:**
```typescript
import { useMutation } from '@apollo/client';
import { UPDATE_MEMBER, GET_MEMBERS } from '@/graphql/members';

const [updateMember, { loading }] = useMutation(UPDATE_MEMBER, {
  onCompleted: () => {
    form.reset();
    setError('');
    refetch();
    close();
  },
  onError: (error) => {
    setError(error.message);
  },
  refetchQueries: [{ query: GET_MEMBERS }],
});

// Chamada
updateMember({
  variables: {
    id: selectedMember.id,
    input: form.values,
  },
});
```

### 5. Delete Mutation

**Antes:**
```typescript
const mutation = useCRUDMutation({
  action: 'delete',
  form,
  refetch,
  close,
  setError,
  endpoint: 'members',
});

// Chamada
mutation.mutate({ id: selectedMember.id });
```

**Depois:**
```typescript
import { useMutation } from '@apollo/client';
import { DELETE_MEMBER, GET_MEMBERS } from '@/graphql/members';

const [deleteMember, { loading }] = useMutation(DELETE_MEMBER, {
  onCompleted: () => {
    refetch();
    close();
  },
  onError: (error) => {
    setError(error.message);
  },
  refetchQueries: [{ query: GET_MEMBERS }],
});

// Chamada
deleteMember({ variables: { id: selectedMember.id } });
```

### 6. Toggle Active (Classes)

**Antes:**
```typescript
import { useClassToggleActiveMutation } from '@/mutations/useClassToggleActiveMutation';

const mutation = useClassToggleActiveMutation();

// Chamada
mutation.mutate({ classId: '123', active: true });
```

**Depois:**
```typescript
import { useClassToggleActiveMutation } from '@/mutations/useClassToggleActiveMutation';

const { toggleActive } = useClassToggleActiveMutation();

// Chamada
toggleActive({ classId: '123', active: true });
```

### 7. Enrollment Flow (Status Update)

**Antes:**
```typescript
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';

const mutation = useEnrollmentFlowMutation();

// Chamada
mutation.mutate({ enrollmentId: '123', status: 'confirmed' });
```

**Depois:**
```typescript
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';

const { mutate, isLoading } = useEnrollmentFlowMutation();

// Chamada
mutate({ enrollmentId: '123', status: 'confirmed' });
```

### 8. Assign Class to Enrollment

**Antes:**
```typescript
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';

const mutation = useEnrollmentAssignClassMutation();

// Chamada
mutation.mutate({ enrollmentId: '123', classId: '456' });
```

**Depois:**
```typescript
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';

const { mutate, isLoading } = useEnrollmentAssignClassMutation();

// Chamada
mutate({ enrollmentId: '123', classId: '456' });
```

---

## 🎨 Padrões de Loading e Error States

### Loading State

```typescript
const { data, loading } = useQuery(GET_MEMBERS);

if (loading) {
  return <Loader />;
}

const members = data?.members || [];
```

### Error State

```typescript
const { data, loading, error } = useQuery(GET_MEMBERS);

if (error) {
  return <Alert color="red">{error.message}</Alert>;
}
```

### Mutation Loading

```typescript
const [createMember, { loading }] = useMutation(CREATE_MEMBER);

<Button loading={loading} onClick={() => createMember({ variables: { input } })}>
  Criar
</Button>
```

---

## 🔧 Helpers Úteis

### Refetch Manual

```typescript
const { data, refetch } = useQuery(GET_MEMBERS);

// Refetch quando necessário
refetch();
```

### Polling (atualização automática)

```typescript
const { data } = useQuery(GET_MEMBERS, {
  pollInterval: 5000, // Atualiza a cada 5 segundos
});
```

### Desabilitar Query Inicial

```typescript
const { data, refetch } = useQuery(GET_MEMBERS, {
  skip: true, // Não executa automaticamente
});

// Executar manualmente
refetch();
```

---

## 📝 Checklist de Migração por Página

### UsersPage
- [ ] `UsersForm.tsx` - Substituir useCRUDMutation
- [ ] Listar usuários - Substituir useCRUDQuery

### MembersPage
- [ ] `MembersForm.tsx` - Substituir useCRUDMutation
- [ ] Listar membros - Substituir useCRUDQuery

### ClassesPage
- [ ] `ClassesForm.tsx` - Substituir useCRUDMutation
- [ ] Listar turmas - Substituir useCRUDQuery
- [ ] Toggle active - Já migrado ✅

### EnrollmentsPage
- [ ] `EnrollmentsForm.tsx` - Substituir useCRUDMutation
- [ ] Listar inscrições - Substituir useCRUDQuery (com paginação)
- [ ] Update status - Já migrado ✅
- [ ] Assign class - Já migrado ✅

### CallManagementPage
- [ ] `CallManagementForm.tsx` - Verificar uso de hooks

### CertificationPage
- [ ] `CertificationManagementForm.tsx` - Verificar uso de hooks

### LoginPage
- [ ] `LoginPage.tsx` - Já migrado ✅

---

## 🚀 Próximos Passos

1. Migrar formulários (UsersForm, MembersForm, ClassesForm, EnrollmentsForm)
2. Atualizar listas e queries de páginas
3. Remover hooks legados (useCRUDQuery, useCRUDMutation)
4. Remover axios do AuthContext (já feito ✅)
5. Remover dependência do axios do package.json
6. Remover constante BACKEND_ADDRESS
7. Atualizar form público (rancheirosmc-form)

---

## 🎯 Benefícios do GraphQL

- **Type Safety**: Tipos gerados automaticamente
- **Single Endpoint**: Um único endpoint GraphQL
- **Flexible Queries**: Buscar apenas os dados necessários
- **Real-time**: Suporte a subscriptions (futuro)
- **Better Caching**: Apollo Client cache inteligente
- **Optimistic UI**: Atualizações otimistas fáceis
- **Error Handling**: Erros estruturados do GraphQL

---

**Última Atualização**: 21 de Outubro de 2025
**Status**: Hooks migrados ✅ | Páginas pendentes 🔄

