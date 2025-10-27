# 📝 TODO - Melhorias Não Bloqueantes

Este arquivo contém as tarefas de melhoria identificadas na revisão de código que não são bloqueantes para o merge da PR #37, mas devem ser consideradas para futuras iterações.

## 🔍 Validações e Casos de Borda

### ⚠️ Alta Prioridade

- [ ] **Validação de Email**
  - Adicionar validação de formato de email no formulário
  - Implementar regex para formato brasileiro/internacional
  - Local: `EnrollmentsForm.tsx`, `CallManagementForm.tsx`, `CertificationManagementForm.tsx`
  ```typescript
  // Exemplo de validação
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.validate({
    email: (value) => emailRegex.test(value) ? null : 'Email inválido'
  });
  ```

- [ ] **Validação de Telefone**
  - Adicionar validação de formato brasileiro
  - Considerar formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  - Implementar máscara de input
  - Local: Todos os formulários de enrollment
  ```typescript
  // Exemplo de validação
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
  ```

- [ ] **Validação de CNH**
  - Adicionar validação de formato
  - Validar número de caracteres (11 dígitos)
  - Considerar implementar algoritmo de validação da CNH
  - Local: Todos os formulários de enrollment

- [ ] **Tratamento de preferred_city null**
  - Adicionar validação para evitar envio de valores null problemáticos
  - Considerar conversão para string vazia ou undefined conforme necessário
  - Local: `parseSelected` functions

### ⚠️ Média Prioridade

- [ ] **Validação Server-Side**
  - Implementar validações duplicadas no backend
  - Não confiar apenas em validação frontend
  - Retornar mensagens de erro claras do servidor

- [ ] **Tratamento de Erros Aprimorado**
  - Adicionar tratamento específico para diferentes tipos de erro GraphQL
  - Implementar retry logic para erros de rede
  - Melhorar mensagens de erro para o usuário

## 🔄 Refatoração e Qualidade de Código

### ⚠️ Alta Prioridade

- [ ] **Eliminar Duplicação de Código nos Formulários**
  - Os três formulários (Enrollments, CallManagement, Certification) têm código muito similar
  - Considerar criar componente reutilizável ou hook customizado
  - Extrair lógica comum:
    - Geração de `classesOptions`
    - Geração de `locationsOptions`
    - Estrutura de campos comum
  
  ```typescript
  // Proposta: Hook customizado
  function useEnrollmentFormOptions() {
    const { data: classesData } = useQuery(GET_ACTIVE_CLASSES);
    const { data: locationsData } = useQuery(GET_LOCATIONS);
    
    return {
      classesOptions: useMemo(/* ... */),
      locationsOptions: useMemo(/* ... */),
    };
  }
  ```

- [ ] **Criar Componente Base para Formulários de Enrollment**
  - Abstrair campos comuns em componente reutilizável
  - Permitir customização através de props
  - Reduzir manutenção futura

### ⚠️ Média Prioridade

- [ ] **Remover Código Não Utilizado**
  - Revisar imports não utilizados
  - Remover variáveis declaradas mas não usadas
  - Limpar comentários redundantes

- [ ] **Melhorar Documentação do Código**
  - Adicionar JSDoc para funções complexas
  - Documentar props de componentes
  - Adicionar comentários explicativos onde necessário

- [ ] **Testes Automatizados**
  - Adicionar testes unitários para componentes
  - Adicionar testes de integração para fluxos CRUD
  - Testar casos de borda e cenários de erro
  - Testar sincronização form-table

## 🔒 Segurança

### ⚠️ Alta Prioridade

- [ ] **Sanitização de Inputs**
  - Implementar sanitização de campos de texto antes do envio
  - Remover caracteres especiais potencialmente perigosos
  - Considerar uso de bibliotecas como DOMPurify para inputs rich text

- [ ] **Validação de Autorização**
  - Verificar permissões do usuário antes de permitir operações
  - Implementar controle de acesso baseado em roles
  - Validar no backend que usuário tem permissão para editar/deletar

### ⚠️ Média Prioridade

- [ ] **Rate Limiting**
  - Implementar proteção contra spam de requisições
  - Adicionar throttle/debounce em operações frequentes
  - Considerar implementar no nível do Apollo Client

- [ ] **Logging de Segurança**
  - Implementar log de operações sensíveis (delete, update)
  - Registrar tentativas de acesso não autorizado
  - Monitorar padrões suspeitos de uso

## 📊 Performance e UX

### ⚠️ Média Prioridade

- [ ] **Loading States Melhorados**
  - Adicionar skeleton loaders
  - Melhorar feedback visual durante operações
  - Implementar estados de loading granulares

- [ ] **Otimização de Queries**
  - Revisar queries GraphQL para evitar over-fetching
  - Implementar paginação onde apropriado
  - Considerar usar fragments para reutilização

- [ ] **Cache Strategy**
  - Revisar políticas de cache do Apollo Client
  - Implementar invalidação de cache inteligente
  - Otimizar refetch após mutations

## 🧪 Testes

### ⚠️ Alta Prioridade

- [ ] **Testes E2E**
  - Testar fluxo completo de CRUD
  - Testar sincronização form-table
  - Testar navegação entre páginas

- [ ] **Testes de Integração**
  - Testar integração com GraphQL API
  - Testar contexts e providers
  - Testar mutations e queries

### ⚠️ Média Prioridade

- [ ] **Testes Unitários**
  - Testar componentes isoladamente
  - Testar hooks customizados
  - Testar funções utilitárias

## 📚 Documentação

### ⚠️ Baixa Prioridade

- [ ] **Storybook**
  - Adicionar stories para componentes principais
  - Documentar variações e estados
  - Facilitar desenvolvimento isolado

- [ ] **README Atualizado**
  - Documentar arquitetura GraphQL
  - Adicionar exemplos de uso
  - Documentar padrões de desenvolvimento

---

## ✅ Bugs Críticos Resolvidos (Bloqueantes)

- [x] **Bug Crítico: Arquitetura de Contextos Corrigida**
  - ✅ `CallManagementPage.tsx` - Adicionado `GraphQLCRUDProvider`
  - ✅ `CertificationManagementPage.tsx` - Adicionado `GraphQLCRUDProvider`
  - ✅ `CallManagementForm.tsx` - Removido `GraphQLCRUDProvider` duplicado
  - ✅ `CertificationManagementForm.tsx` - Removido `GraphQLCRUDProvider` duplicado

---

## ⚠️ Regras de Produto (Não Alterar)

- **Action Hardcoded como 'create'**: Os formulários mantêm `action = 'create'` como regra de produto
  - `EnrollmentsForm.tsx` - Mantém `action = 'create'`
  - `CallManagementForm.tsx` - Mantém `action = 'create'`
  - `CertificationManagementForm.tsx` - Mantém `action = 'create'`
  - **Justificativa**: Formulários são exclusivamente para criação de novos registros
  - **Comportamento**: Campos `status` e `class` ocultos durante criação (intencional)

---

**Nota**: As tarefas acima devem ser priorizadas conforme necessidade do projeto e disponibilidade da equipe. Recomenda-se começar pelos itens de Alta Prioridade.

**Última atualização**: 2025-10-27
