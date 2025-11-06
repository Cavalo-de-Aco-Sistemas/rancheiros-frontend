# 🏗️ Arquitetura GraphQL - Rancheiros Frontend

## 📋 Visão Geral

Esta documentação descreve a arquitetura de integração GraphQL no frontend do projeto Rancheiros. A arquitetura foi projetada seguindo as melhores práticas para criar uma camada de abstração limpa, onde **as páginas nunca acessam GraphQL diretamente**, apenas através de hooks e providers especializados.

---

## 🎯 Princípios Fundamentais

### 1. **Separação de Responsabilidades**
- **Páginas**: Apenas composição de componentes e estado de UI
- **Providers**: Gerenciam queries GraphQL e estado global
- **Hooks**: Encapsulam lógica de negócio e acesso a dados
- **Componentes**: Apresentação e interação do usuário

### 2. **Abstração do GraphQL**
- Nenhuma página importa diretamente queries GraphQL
- Apollo Client é completamente encapsulado nos providers
- Mudanças na camada de dados não afetam as páginas

### 3. **Reutilização de Código**
- Componentes genéricos (`CRUDTable`, `GraphQLCRUDForm`)
- Providers modulares por entidade
- Compatibilidade retroativa com código REST

---

## 📁 Estrutura de Arquivos

```
src/
├── contexts/
│   ├── GraphQLCRUDContext.tsx    # ✅ Provider genérico para CRUD com GraphQL
│   └── CRUDContext.tsx            # 🔄 Provider legacy REST (backward compatibility)
│
├── hooks/
│   ├── useMembers.tsx             # 🆕 Provider específico para Members
│   ├── useClasses.tsx             # 🆕 Provider específico para Classes
│   ├── useUsers.tsx               # 🆕 Provider específico para Users
│   ├── useEnrollments.tsx         # 🆕 Provider específico para Enrollments
│   ├── useLocations.tsx           # 🆕 Provider específico para Locations
│   └── useRanches.tsx             # 🆕 Provider específico para Ranches
│
├── graphql/
│   ├── members.ts                 # Queries e Mutations GraphQL para Members
│   ├── classes.ts                 # Queries e Mutations GraphQL para Classes
│   ├── users.ts                   # Queries e Mutations GraphQL para Users
│   ├── enrollments.ts             # Queries e Mutations GraphQL para Enrollments
│   ├── locations.ts               # Queries e Mutations GraphQL para Locations
│   └── ranches.ts                 # Queries e Mutations GraphQL para Ranches
│
├── components/
│   ├── CRUDTable/                 # ✅ Tabela genérica (suporta REST e GraphQL)
│   └── GraphQLCRUDForm/           # ✅ Formulário genérico para GraphQL
│
└── pages/
    ├── MembersPage/
    │   ├── index.tsx              # ✅ Usa MembersProvider
    │   ├── MembersTable.tsx       # ✅ Usa useGraphQLCRUD()
    │   └── MembersForm.tsx        # ✅ Usa GraphQLCRUDForm
    │
    ├── ClassesPage/               # 🔄 A migrar
    ├── UsersPage/                 # 🔄 A migrar
    ├── EnrollmentsPage/           # 🔄 A migrar
    └── ...
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                         (MembersPage)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MembersProvider                            │
│  - Encapsula GET_MEMBERS query                                  │
│  - Fornece GraphQLCRUDContext                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GraphQLCRUDProvider                            │
│  - Executa query GraphQL via Apollo Client                     │
│  - Transforma dados para interface compatível                   │
│  - Gerencia estados (loading, error, data)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Apollo Client                               │
│  - Cache                                                         │
│  - Network requests                                              │
│  - Authentication (via AuthLink)                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GraphQL Backend                               │
│  (NestJS + Apollo Server)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes da Arquitetura

### 1. **GraphQLCRUDContext** (Core)

Contexto genérico que encapsula qualquer query GraphQL e fornece interface compatível com `CRUDContext`.

**Características:**
- ✅ Executa queries GraphQL via Apollo Client
- ✅ Transforma resposta para formato esperado
- ✅ Gerencia estados de loading, error, data
- ✅ Compatível com componentes existentes (CRUDTable)
- ✅ Suporta filtros e paginação

**Interface:**
```typescript
interface GraphQLCRUDContextType<T> {
  query: {
    data: T[] | undefined;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error: ApolloError | null;
    refetch: () => void;
  };
  setSelected: (item: T) => void;
  setAction: (action: 'create' | 'update' | 'delete') => void;
  action: 'create' | 'update' | 'delete';
  open: () => void;
  close: () => void;
  opened: boolean;
  selected?: T;
  columnFilters: ColumnFilter[];
  setColumnFilters: (filters: ColumnFilter[]) => void;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}
```

---

### 2. **Entity Providers** (hooks/)

Providers específicos para cada entidade que encapsulam a query GraphQL correspondente.

**Exemplo: MembersProvider**
```typescript
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_MEMBERS } from '@/graphql/members';

export function MembersProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_MEMBERS} dataKey="members">
      {children}
    </GraphQLCRUDProvider>
  );
}
```

**Benefícios:**
- ✅ Encapsula query GraphQL
- ✅ Nome semântico e específico
- ✅ Fácil de testar
- ✅ Reutilizável em múltiplas páginas

---

### 3. **CRUDTable** (Componente Genérico)

Componente genérico que funciona com **REST e GraphQL** automaticamente.

**Detecção Automática de Contexto:**
```typescript
const graphqlContext = useContext(GraphQLCRUDContext);
const restContext = useContext(CRUDContext);

const context = graphqlContext || restContext;
```

**Características:**
- ✅ Suporta GraphQL e REST (backward compatibility)
- ✅ Renderização de tabelas com Mantine React Table
- ✅ Exportação para CSV e PDF
- ✅ Paginação client-side
- ✅ Filtros e busca global
- ✅ Ações customizadas por linha
- ✅ Estados de loading e error

---

### 4. **GraphQLCRUDForm** (Componente Genérico)

Formulário genérico para criar/editar/deletar entidades via GraphQL.

**Características:**
- ✅ Suporta mutations GraphQL
- ✅ Validação com Zod
- ✅ Modo create/update/delete
- ✅ Integração com Apollo Client cache
- ✅ Feedback visual (notifications)

---

## 📝 Guia de Uso

### Criar uma Nova Página CRUD com GraphQL

#### 1. Criar GraphQL Queries/Mutations

```typescript
// src/graphql/myentity.ts
import { gql } from '@apollo/client';

export const GET_MY_ENTITIES = gql`
  query GetMyEntities {
    myEntities {
      id
      name
      description
      created_at
    }
  }
`;

export const CREATE_MY_ENTITY = gql`
  mutation CreateMyEntity($input: CreateMyEntityInput!) {
    createMyEntity(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_MY_ENTITY = gql`
  mutation UpdateMyEntity($id: ID!, $input: UpdateMyEntityInput!) {
    updateMyEntity(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_MY_ENTITY = gql`
  mutation DeleteMyEntity($id: ID!) {
    deleteMyEntity(id: $id) {
      id
    }
  }
`;
```

#### 2. Criar Entity Provider

```typescript
// src/hooks/useMyEntity.tsx
import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_MY_ENTITIES } from '@/graphql/myentity';

export function MyEntityProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_MY_ENTITIES} dataKey="myEntities">
      {children}
    </GraphQLCRUDProvider>
  );
}
```

#### 3. Criar Página

```typescript
// src/pages/MyEntityPage/index.tsx
import { MyEntityProvider } from '@/hooks/useMyEntity';
import MyEntityTable from './MyEntityTable';
import MyEntityForm from './MyEntityForm';

export function MyEntityPage() {
  return (
    <MyEntityProvider>
      <MyEntityTable />
      <MyEntityForm />
    </MyEntityProvider>
  );
}
```

#### 4. Criar Tabela

```typescript
// src/pages/MyEntityPage/MyEntityTable.tsx
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { MyEntity } from '@/model/myentity';

export function MyEntityTable() {
  const { query } = useGraphQLCRUD();
  const data = (query.data || []) as MyEntity[];

  const columns = useMemo<MRT_ColumnDef<MyEntity>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      { accessorKey: 'description', header: 'Descrição' },
    ],
    []
  );

  const csvData = useMemo(
    () => data.map(({ name, description }) => ({ Nome: name, Descrição: description })),
    [data]
  );

  const pdfConfig = useMemo(
    () => ({
      tableHeaders: ['Nome', 'Descrição'],
      rowMapper: (row: MRT_Row<MyEntity>) => [row.original.name, row.original.description],
    }),
    []
  );

  return (
    <CRUDTable
      columns={columns}
      title="Minhas Entidades"
      csvData={csvData}
      pdfConfig={pdfConfig}
      data={data}
    />
  );
}
```

#### 5. Criar Formulário

```typescript
// src/pages/MyEntityPage/MyEntityForm.tsx
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { CREATE_MY_ENTITY, UPDATE_MY_ENTITY, DELETE_MY_ENTITY } from '@/graphql/myentity';

export function MyEntityForm() {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
  });

  return (
    <GraphQLCRUDForm
      form={form}
      queryKey="GET_MY_ENTITIES"
      createMutation={CREATE_MY_ENTITY}
      updateMutation={UPDATE_MY_ENTITY}
      deleteMutation={DELETE_MY_ENTITY}
      title="Minha Entidade"
    >
      {/* Campos do formulário */}
    </GraphQLCRUDForm>
  );
}
```

---

## 🎨 Melhores Práticas

### ✅ DO (Faça)

1. **Use providers específicos**
   ```tsx
   <MembersProvider>
     <MembersTable />
   </MembersProvider>
   ```

2. **Acesse dados via hook**
   ```tsx
   const { query } = useGraphQLCRUD();
   const members = query.data as Member[];
   ```

3. **Type casting para tipagem forte**
   ```tsx
   const data = (query.data || []) as Member[];
   ```

4. **Documente providers customizados**
   ```typescript
   /**
    * MembersProvider
    * 
    * Provider para gerenciar o estado CRUD de Membros usando GraphQL.
    */
   ```

### ❌ DON'T (Não Faça)

1. **Nunca use Apollo Client diretamente nas páginas**
   ```tsx
   // ❌ NÃO FAÇA ISSO
   const { data } = useQuery(GET_MEMBERS);
   ```

2. **Não importe queries GraphQL nas páginas**
   ```tsx
   // ❌ NÃO FAÇA ISSO
   import { GET_MEMBERS } from '@/graphql/members';
   ```

3. **Não duplique lógica de providers**
   ```tsx
   // ❌ NÃO FAÇA ISSO
   // Crie um provider reutilizável ao invés de copiar código
   ```

---

## 🔄 Compatibilidade Retroativa

A arquitetura suporta **REST e GraphQL simultaneamente**:

- **CRUDTable** detecta automaticamente qual contexto usar
- Páginas antigas com `CRUDProvider` continuam funcionando
- Migração gradual sem quebrar funcionalidades existentes

```typescript
// REST (Legacy)
<CRUDProvider endpoint="members">
  <MembersTable />
</CRUDProvider>

// GraphQL (Novo)
<MembersProvider>
  <MembersTable />
</MembersProvider>

// Ambos funcionam com o mesmo CRUDTable! ✅
```

---

## 🧪 Testabilidade

### Testar Providers

```typescript
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MembersProvider } from '@/hooks/useMembers';
import { GET_MEMBERS } from '@/graphql/members';

const mocks = [
  {
    request: { query: GET_MEMBERS },
    result: {
      data: {
        members: [
          { id: '1', name: 'João Silva', patch: 'Joãozinho' },
        ],
      },
    },
  },
];

test('renders members', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <MembersProvider>
        <MembersTable />
      </MembersProvider>
    </MockedProvider>
  );

  expect(await screen.findByText('João Silva')).toBeInTheDocument();
});
```

---

## 📊 Status da Migração

| Módulo | Provider | Página | Tabela | Formulário | Status |
|--------|----------|--------|--------|------------|--------|
| **Members** | ✅ | ✅ | ✅ | ✅ | **Completo** |
| Classes | ✅ | 🔄 | 🔄 | ✅ | Em progresso |
| Users | ✅ | 🔄 | 🔄 | ✅ | Em progresso |
| Enrollments | ✅ | 🔄 | 🔄 | ✅ | Em progresso |
| Locations | ✅ | 🔄 | 🔄 | 🔄 | Em progresso |
| Ranches | ✅ | 🔄 | 🔄 | 🔄 | Em progresso |

---

## 🚀 Próximos Passos

1. ✅ **Migrar páginas restantes** seguindo o padrão de Members
2. 📝 **Documentar componentes** com JSDoc
3. 🧪 **Adicionar testes** para providers e componentes
4. 🧹 **Remover código REST** após migração completa
5. 📦 **Otimizar bundle** removendo dependências não utilizadas

---

## 📚 Referências

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [React Context Best Practices](https://react.dev/reference/react/useContext)
- [Mantine React Table](https://www.mantine-react-table.com/)

---

**✨ Arquitetura criada com foco em: Manutenibilidade, Escalabilidade e Developer Experience**

