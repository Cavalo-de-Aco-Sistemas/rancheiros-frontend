# Frontend GraphQL - Checklist de Testes

## 🎯 Objetivo
Testar todas as funcionalidades migradas para GraphQL no frontend.

## ✅ Pré-requisitos

- [x] Backend rodando em `http://localhost:3000`
- [x] GraphQL Playground disponível em `http://localhost:3000/graphql`
- [ ] Frontend rodando (geralmente `http://localhost:5173` ou similar)

## 📋 Testes a Realizar

### 1. Autenticação (Login)

**Página**: `/login`

- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas (testar mensagem de erro)
- [ ] Verificar se token JWT é armazenado
- [ ] Verificar se Apollo Client inclui token nas requests

**Como testar:**
1. Abrir DevTools → Network tab
2. Fazer login
3. Verificar request GraphQL `login`
4. Verificar response com `access_token`

---

### 2. Membros (Members)

**Página**: `/members`

#### Listar Membros
- [ ] Lista carrega corretamente
- [ ] Dados exibidos completos (nome, patch, rancho, etc.)
- [ ] Loading state funciona

#### Criar Membro
- [ ] Abrir modal de criação
- [ ] Preencher formulário
- [ ] Submeter e verificar sucesso
- [ ] Lista atualiza automaticamente (refetch)
- [ ] Validações funcionam (campos obrigatórios)

#### Editar Membro
- [ ] Selecionar membro existente
- [ ] Modal preenche com dados corretos
- [ ] Alterar dados
- [ ] Salvar e verificar atualização
- [ ] Lista atualiza

#### Deletar Membro
- [ ] Tentar deletar membro (soft delete)
- [ ] Verificar confirmação
- [ ] Verificar atualização da lista

**Mutation GraphQL esperada:**
```graphql
mutation CreateMember {
  createMember(input: {
    name: "Teste"
    patch: "TESTE"
    ranch: "RANCH_ID"
    phase: "prospect"
    # ... outros campos
  }) {
    id
    name
    patch
  }
}
```

---

### 3. Turmas (Classes)

**Página**: `/classes`

#### Listar Turmas
- [ ] Lista carrega
- [ ] Exibe data, local, status ativo/inativo
- [ ] Loading state

#### Criar Turma
- [ ] Preencher local, data, link do maps
- [ ] Toggle "ativo" funciona
- [ ] Submeter e verificar

#### Editar Turma
- [ ] Editar dados
- [ ] Salvar
- [ ] Verificar atualização

#### Toggle Ativo/Inativo
- [ ] Clicar para ativar/desativar turma
- [ ] Verificar atualização instantânea (optimistic UI)
- [ ] Verificar notificação de sucesso

**Mutation esperada (toggle):**
```graphql
mutation UpdateClass {
  updateClass(id: "CLASS_ID", input: { active: true }) {
    id
    active
  }
}
```

---

### 4. Usuários (Users)

**Página**: `/users`

#### Listar Usuários
- [ ] Lista carrega
- [ ] Exibe username, nome, permissões

#### Criar Usuário
- [ ] Preencher username, nome, senha
- [ ] Configurar permissões (checkboxes)
- [ ] Selecionar ranchos
- [ ] Verificar validação de senha
- [ ] Submeter

#### Editar Usuário
- [ ] Editar dados
- [ ] Alterar permissões
- [ ] Salvar

#### Trocar Senha
- [ ] Usar funcionalidade de trocar senha
- [ ] Verificar nova senha funciona

---

### 5. Inscrições (Enrollments)

**Página**: `/enrollments`

#### Listar Inscrições (com Paginação)
- [ ] Lista carrega
- [ ] Paginação funciona (página 1, 2, ...)
- [ ] Filtros funcionam:
  - [ ] Por nome
  - [ ] Por telefone
  - [ ] Por email
  - [ ] Por cidade preferida
  - [ ] Por status
- [ ] Busca global funciona

**Query esperada:**
```graphql
query GetEnrollments {
  enrollments(
    pagination: { page: 1, limit: 50, search: "João" }
    status: "waiting"
  ) {
    data {
      id
      name
      phone
      status
    }
    total
    page
    limit
    totalPages
  }
}
```

#### Criar Inscrição
- [ ] Preencher formulário
- [ ] Submeter
- [ ] Verificar na lista

#### Editar Inscrição
- [ ] Editar dados
- [ ] Salvar

#### Deletar Inscrição
- [ ] Deletar
- [ ] Verificar remoção

---

### 6. Fluxo de Inscrições (Enrollment Flow)

**Página**: `/call-management` ou `/enrollments`

#### Mudar Status
- [ ] Alterar status: Waiting → Called
- [ ] Alterar status: Called → Confirmed
- [ ] Alterar status: Confirmed → Certified
- [ ] Alterar status para Dropped/Ignored/Missed
- [ ] Verificar notificações de sucesso
- [ ] Verificar atualização da lista

**Mutation esperada:**
```graphql
mutation UpdateStatus {
  updateEnrollmentStatus(
    id: "ENROLLMENT_ID"
    input: { status: "confirmed" }
  ) {
    id
    status
  }
}
```

#### Atribuir Turma
- [ ] Selecionar inscrição confirmada
- [ ] Atribuir turma
- [ ] Verificar atualização
- [ ] Verificar notificação

**Mutation esperada:**
```graphql
mutation AssignClass {
  assignClassToEnrollment(
    id: "ENROLLMENT_ID"
    input: { classId: "CLASS_ID" }
  ) {
    id
    class {
      id
      date
      location { name }
    }
  }
}
```

---

### 7. Locais (Locations)

**Página**: `/locations` (se existir)

- [ ] Listar locais
- [ ] Criar local
- [ ] Editar local
- [ ] Deletar local

---

### 8. Certificação (Certification)

**Página**: `/certification`

- [ ] Listar inscrições confirmadas por turma
- [ ] Certificar alunos (mudar status para "certified")
- [ ] Marcar falta (status "missed")

---

## 🔍 Testes de Integração GraphQL

### Verificar Apollo Client DevTools

1. Instalar extensão: [Apollo Client DevTools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)
2. Abrir DevTools → Apollo tab
3. Verificar:
   - [ ] Cache está populado
   - [ ] Queries sendo executadas
   - [ ] Mutations sendo enviadas

### Verificar Requests no Network Tab

1. Abrir DevTools → Network tab
2. Filtrar por "graphql"
3. Para cada operação, verificar:
   - [ ] Request contém header `Authorization: Bearer <token>`
   - [ ] Request body tem `query` e `variables`
   - [ ] Response tem `data` ou `errors`

### Testar Error Handling

- [ ] Desconectar backend e verificar mensagens de erro
- [ ] Tentar operação sem permissão (verificar erro de autorização)
- [ ] Submeter dados inválidos (verificar validação)

---

## 🐛 Problemas Conhecidos e Soluções

### Erro: "Cannot read properties of undefined"

**Causa**: Query retorna `undefined` antes de carregar  
**Solução**: Usar optional chaining e valores default:
```typescript
const members = data?.members || [];
```

### Erro: "Network error"

**Causa**: Backend não está rodando ou Apollo Client não configurado  
**Solução**: Verificar `http://localhost:3000/graphql`

### Erro: "Unauthorized" / "Forbidden"

**Causa**: Token JWT ausente ou expirado  
**Solução**: Fazer logout e login novamente

### Lista não atualiza após mutation

**Causa**: `refetchQueries` não configurado  
**Solução**: Verificar se mutation tem `refetchQueries: [{ query: GET_XXX }]`

---

## ✅ Checklist de Componentes Migrados

### Hooks
- [x] `useLoginMutation` - Login
- [x] `useClassToggleActiveMutation` - Toggle turma ativa
- [x] `useEnrollmentFlowMutation` - Fluxo de inscrição
- [x] `useEnrollmentAssignClassMutation` - Atribuir turma
- [x] `useConfirmedEnrollmentsQuery` - Inscrições confirmadas

### Formulários
- [x] `MembersForm` - CRUD Membros
- [x] `ClassesForm` - CRUD Turmas
- [x] `UsersForm` - CRUD Usuários
- [x] `EnrollmentsForm` - CRUD Inscrições
- [x] `CallManagementForm` - Gestão de chamadas
- [x] `CertificationManagementForm` - Gestão de certificação

### Componentes
- [x] `GraphQLCRUDForm` - Wrapper para formulários CRUD

---

## 📊 Métricas de Sucesso

- [ ] Todas as operações CRUD funcionam
- [ ] Paginação funciona corretamente
- [ ] Filtros funcionam
- [ ] Mutations atualizam cache automaticamente
- [ ] Loading states aparecem corretamente
- [ ] Error handling funciona
- [ ] Notificações (success/error) aparecem
- [ ] Performance é boa (< 1s para queries simples)

---

## 🚀 Próximos Passos Após Testes

Se todos os testes passarem:

1. ✅ Remover código legado:
   - `useCRUDQuery.ts`
   - `useCRUDMutation.ts`
   - `CRUDForm` (manter como fallback ou remover)
   - Axios do package.json
   - `BACKEND_ADDRESS` constant

2. ✅ Migrar form público (rancheirosmc-form)

3. ✅ Opcional: Remover REST controllers do backend

---

**Data**: 21 de Outubro de 2025  
**Status**: Frontend migrado para GraphQL ✅  
**Próximo**: Testes de integração 🧪

