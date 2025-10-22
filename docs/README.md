# Documentação do Projeto Rancheiros

Esta pasta contém toda a documentação técnica do projeto, organizada por categoria.

## 📋 Índice de Documentos

### 🔧 Correções e Fixes

- **[DATE_VALIDATION_FIX.md](./DATE_VALIDATION_FIX.md)** - Correção de erro de data inválida no formulário de edição dos membros
- **[DATE_FORMATTING_FIX.md](./DATE_FORMATTING_FIX.md)** - Correção de formatação de datas no frontend
- **[GRAPHQL_INPUT_FIELDS_FIX.md](./GRAPHQL_INPUT_FIELDS_FIX.md)** - Correção de campos extras sendo enviados no GraphQL Input
- **[PAGINATION_INDEX_FIX.md](./PAGINATION_INDEX_FIX.md)** - Correção de problema de paginação na tabela
- **[CRUD_PROVIDER_FIX.md](./CRUD_PROVIDER_FIX.md)** - Correção de erro "useCRUD must be used within a CRUDProvider"
- **[STATUS_NORMALIZATION_FIX.md](./STATUS_NORMALIZATION_FIX.md)** - Correção de normalização de status de inscrições

### 🚀 Migração GraphQL

- **[GRAPHQL_MIGRATION_GUIDE.md](./GRAPHQL_MIGRATION_GUIDE.md)** - Guia completo para migração de REST para GraphQL
- **[GRAPHQL_MIGRATION_SUMMARY.md](./GRAPHQL_MIGRATION_SUMMARY.md)** - Resumo da migração GraphQL
- **[GRAPHQL_MIGRATION_STATUS.md](./GRAPHQL_MIGRATION_STATUS.md)** - Status da migração GraphQL
- **[GRAPHQL_ARCHITECTURE.md](./GRAPHQL_ARCHITECTURE.md)** - Arquitetura GraphQL implementada
- **[GRAPHQL_TEST_CHECKLIST.md](./GRAPHQL_TEST_CHECKLIST.md)** - Checklist de testes para GraphQL

### 🔍 Implementações e Otimizações

- **[SHARED_DATA_OPTIMIZATION.md](./SHARED_DATA_OPTIMIZATION.md)** - Otimização de compartilhamento de dados entre páginas
- **[SHARED_FILTERS_IMPLEMENTATION.md](./SHARED_FILTERS_IMPLEMENTATION.md)** - Implementação de filtros compartilhados
- **[MANTINE_FILTERS_IMPLEMENTATION.md](./MANTINE_FILTERS_IMPLEMENTATION.md)** - Implementação de filtros nativos do Mantine
- **[CALL_MANAGEMENT_FILTER_IMPLEMENTATION.md](./CALL_MANAGEMENT_FILTER_IMPLEMENTATION.md)** - Implementação de filtros para Call Management
- **[CALL_MANAGEMENT_FILTER_CORRECT_IMPLEMENTATION.md](./CALL_MANAGEMENT_FILTER_CORRECT_IMPLEMENTATION.md)** - Implementação correta de filtros para Call Management

### 📊 Análises

- **[DATA_SHARING_ANALYSIS.md](./DATA_SHARING_ANALYSIS.md)** - Análise de compartilhamento de dados entre páginas

## 📁 Estrutura da Documentação

```
docs/
├── README.md                                    # Este arquivo
├── DATE_VALIDATION_FIX.md                      # Correção de validação de datas
├── DATE_FORMATTING_FIX.md                      # Correção de formatação de datas
├── GRAPHQL_INPUT_FIELDS_FIX.md                 # Correção de campos GraphQL
├── PAGINATION_INDEX_FIX.md                     # Correção de paginação
├── CRUD_PROVIDER_FIX.md                        # Correção de CRUD Provider
├── STATUS_NORMALIZATION_FIX.md                 # Correção de normalização
├── GRAPHQL_MIGRATION_GUIDE.md                  # Guia de migração
├── GRAPHQL_MIGRATION_SUMMARY.md                # Resumo da migração
├── GRAPHQL_MIGRATION_STATUS.md                 # Status da migração
├── GRAPHQL_ARCHITECTURE.md                     # Arquitetura GraphQL
├── GRAPHQL_TEST_CHECKLIST.md                  # Checklist de testes
├── SHARED_DATA_OPTIMIZATION.md                # Otimização de dados
├── SHARED_FILTERS_IMPLEMENTATION.md            # Filtros compartilhados
├── MANTINE_FILTERS_IMPLEMENTATION.md           # Filtros Mantine
├── CALL_MANAGEMENT_FILTER_IMPLEMENTATION.md    # Filtros Call Management
├── CALL_MANAGEMENT_FILTER_CORRECT_IMPLEMENTATION.md # Filtros corretos
└── DATA_SHARING_ANALYSIS.md                    # Análise de dados
```

## 🎯 Como Usar Esta Documentação

### Para Desenvolvedores

1. **Correções**: Consulte os arquivos de fix para entender problemas resolvidos
2. **Migração**: Use o guia de migração para implementar GraphQL
3. **Testes**: Siga o checklist de testes para validar implementações
4. **Arquitetura**: Entenda a estrutura GraphQL através da documentação de arquitetura

### Para Manutenção

1. **Problemas Conhecidos**: Verifique os arquivos de fix para soluções
2. **Implementações**: Consulte os guias de implementação para novas funcionalidades
3. **Otimizações**: Use as análises para melhorar performance

## 📝 Convenções

- **Formato**: Todos os documentos seguem o padrão Markdown
- **Estrutura**: Cada documento tem seções claras e exemplos de código
- **Atualização**: Documentos são atualizados conforme mudanças no projeto
- **Versionamento**: Mudanças significativas são documentadas no CHANGELOG.md

## 🔗 Links Úteis

- **[CHANGELOG.md](../CHANGELOG.md)** - Histórico de mudanças do projeto
- **[README.md](../README.md)** - Documentação principal do projeto
- **[GraphQL Playground](http://localhost:3000/graphql)** - Interface de testes GraphQL (desenvolvimento)

---

**Última atualização**: 22 de Outubro de 2024
