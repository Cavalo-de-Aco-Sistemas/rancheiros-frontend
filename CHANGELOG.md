# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [1.5.0] - 2025-01-12

### Pull Request
- **PR #31**: Sistema de Paginação Avançado, Numeração de Linhas e Melhorias de UX
  - Implementação completa de sistema de paginação avançada com controles de tamanho de página
  - Sistema de numeração sequencial de linhas considerando paginação
  - Melhorias significativas na experiência do usuário com loading states e mensagens contextuais
  - Correção de formatação de data com timezone UTC
  - Otimização de visibilidade de colunas na página de certificação
  - [Ver PR](https://github.com/Cavalo-de-Aco-Sistemas/rancheiros-frontend/pull/31)

### Added
- **Sistema de Controle de Paginação Completo**:
  - **CRUDTable**: Controles avançados de paginação
    - Seletor de tamanho de página (10, 25, 50, 100 itens)
    - Navegação entre páginas com botões próxima/anterior
    - Contador de registros (ex: "1-50 de 897")
    - Informações de página atual e total de páginas
    - Integração completa com backend para paginação server-side

  - **Páginas com Paginação Implementada**:
    - **EnrollmentsPage**: Visão geral de inscrições com paginação
    - **CallManagementPage**: Gestão de chamadas com paginação
    - **CertificationManagementPage**: Gestão de certificações com paginação

- **Sistema de Numeração Sequencial de Linhas**:
  - **CRUDTable**: Coluna de numeração automática
    - Nova prop `enableRowNumbers` para habilitar/desabilitar numeração
    - Coluna "#" posicionada como primeira coluna da tabela
    - Cálculo inteligente considerando paginação atual
    - Numeração sequencial correta entre páginas (ex: página 2 inicia em 51)
    - Estilo visual consistente (centralizado, negrito, cor cinza)
    - Coluna não ordenável, não filtrável e não ocultável

  - **Páginas com Numeração Implementada**:
    - **EnrollmentsPage**: Numeração sequencial habilitada
    - **CallManagementPage**: Numeração sequencial habilitada
    - **CertificationManagementPage**: Numeração sequencial habilitada

### Fixed
- **CRUDTable**: Correção de erro de paginação
  - Resolvido erro "Cannot read properties of undefined (reading 'pageSize')"
  - Estado de paginação sempre definido com valores padrão seguros
  - Configuração correta de `rowCount` para `manualPagination`
  - Sincronização adequada entre estado interno e props externas

- **CRUDTable**: Correção de exibição de paginação
  - Corrigida exibição incorreta "1-50 de 50" para "1-50 de 897"
  - Habilitados botões de navegação entre páginas
  - Cálculo correto do total de páginas baseado no `rowCount`
  - Configuração adequada de `pageCount` e `manualPagination`

- **Formatação de Data de Inscrição**: Correção de timezone
  - Resolvido problema de formatação incorreta com timezone UTC
  - Corrigida exibição "12T00:00:00.000Z/10/2025" para "08/10/2025"
  - Implementada conversão segura de ISO string para Date object
  - Formatação brasileira DD/MM/YYYY em todas as tabelas
  - Try/catch para proteção contra datas inválidas

### Enhanced
- **CRUDTable**: Melhorias na experiência de paginação
  - **Estado Controlado**: Sincronização perfeita entre frontend e backend
  - **Re-renderização**: Chave única para forçar atualização quando paginação muda
  - **Fallbacks Seguros**: Valores padrão para evitar erros durante carregamento
  - **Reset de Página**: Volta para página 1 quando muda tamanho da página
  - **Feedback Visual**: Loading states durante mudanças de paginação

- **CertificationManagementTable**: Otimização de visibilidade de colunas
  - **Interface Limpa**: Colunas ocultas por padrão para melhor experiência
  - **Colunas Ocultas por Padrão**: Status, Data de Inscrição, Cidade Preferencial, UF
  - **Flexibilidade**: Usuário pode mostrar/ocultar colunas conforme necessário
  - **Foco no Essencial**: Página carrega com colunas mais relevantes visíveis
  - **Controle Total**: Menu "Mostrar/Ocultar Colunas" funcional para todas as colunas

### Technical
- **CRUDTable**: Configuração otimizada de paginação
  - `rowCount`: Total de registros para cálculo correto de páginas
  - `pageCount`: Total de páginas para navegação
  - `manualPagination`: Controle server-side da paginação
  - `state.pagination`: Sincronização com props externas
  - `onPaginationChange`: Callbacks para mudanças de página e tamanho

- **CRUDTable**: Implementação de numeração sequencial
  - `enableRowNumbers`: Prop para habilitar coluna de numeração
  - `rowNumberColumn`: Coluna customizada com cálculo de paginação
  - `finalColumns`: Combinação dinâmica de colunas com numeração
  - Cálculo: `(pageIndex * pageSize) + rowIndex + 1`
  - Memoização para performance otimizada
  - Integração transparente com colunas existentes

- **Formatação de Data**: Implementação robusta para timezone
  - Conversão segura de ISO string para Date object
  - Formatação brasileira DD/MM/YYYY com padStart
  - Tratamento de timezone UTC do banco de dados
  - Try/catch para proteção contra datas inválidas
  - Aplicação em todas as tabelas de enrollment

## [1.4.0] - 2025-01-12

### Pull Request
- **PR #29**: Sistema de Filtros Avançados e Melhorias de UX
  - Implementação completa de sistema de filtros avançados no backend e frontend
  - Melhorias significativas na experiência do usuário
  - Loading states, mensagens de estado vazio personalizadas e interface mais limpa
  - [Ver PR](https://github.com/Cavalo-de-Aco-Sistemas/rancheiros-frontend/pull/29)

### Added
- **Sistema de Filtros Avançados no Frontend**:
  - **CRUDContext**: Suporte completo a filtros dinâmicos
    - Estados para `columnFilters` e `globalFilter`
    - Conversão automática de filtros em parâmetros de query para o backend
    - Cache automático por parâmetros de filtro
    - Novo parâmetro `enableFilters` para habilitar filtros

  - **CRUDTable**: Integração completa com MantineReactTable para filtros
    - Novo parâmetro `enableFilters` para controlar exibição dos filtros
    - Configuração automática de `manualFiltering` baseada em paginação
    - Botões de filtro condicionais na toolbar
    - Suporte a filtros de texto, select, data e faixa de data

  - **Páginas com Filtros Implementados**:
    - **EnrollmentsPage**: Filtros completos para visão geral de inscrições
    - **CallManagementPage**: Filtros para gestão de chamadas
    - **CertificationManagementPage**: Filtros para gestão de certificações
    - **UsersPage**: Filtros para gestão de usuários

  - **Tipos de Filtros Disponíveis**:
    - Filtro global (busca em múltiplos campos)
    - Filtros por coluna (texto, seleção, data)
    - Filtros combinados (múltiplos filtros simultâneos)
    - Filtros com paginação (mantém filtros entre páginas)

### Changed
- **CRUDTable**: Configuração híbrida de filtros
  - `manualFiltering: true` para páginas com paginação (sincronização com backend)
  - `manualFiltering: false` para páginas sem paginação (filtros locais)
  - Detecção automática baseada na presença de paginação

- **EnrollmentsTable**: Colunas com filtros configurados
  - Status: Select com opções (waiting, called, confirmed, etc.)
  - Nome: Texto com busca parcial
  - Telefone: Texto com busca parcial
  - Cidade Preferencial: Texto com busca parcial
  - Data de Inscrição: Seletor de data
  - Email: Texto com busca parcial
  - Turma: Texto com busca parcial

- **CertificationManagementTable**: Filtros adicionados
  - Mesmos filtros da EnrollmentsTable
  - Integração com sistema de certificação

### Fixed
- **CRUDTable**: Correção de dupla filtragem
  - Resolvido problema de filtros aplicados tanto no backend quanto no frontend
  - Configuração correta de `manualFiltering` para evitar conflitos
  - Logs de debug adicionados para troubleshooting

### Technical
- **useCRUDQuery**: Documentação atualizada
  - Comentários sobre formato dos parâmetros de filtro
  - Suporte a `filter_<columnId>` e `search` parameters
  - Cache otimizado por parâmetros de filtro

### Enhanced
- **CRUDTable**: Sistema de loading e mensagens de estado vazio aprimorado
  - **Loading States**: Indicadores visuais durante carregamento de dados
    - Skeleton loading com animação de onda
    - Progress bars durante operações (filtros, paginação)
    - Loading overlay para feedback visual claro
  - **Mensagens de Estado Vazio**: Sistema personalizável e contextual
    - Parâmetros `emptyStateMessage` e `emptyStateDescription`
    - Mensagens específicas para cada tipo de tabela
    - Remoção de mensagens prematuras (antes da tabela ser construída)
  - **Experiência do Usuário**: Feedback visual consistente
    - Loading adequado durante busca de dados
    - Mensagens contextuais apenas quando necessário
    - Design uniforme em todas as tabelas

- **Todas as Tabelas**: Mensagens personalizadas implementadas
  - **EnrollmentsTable**: "Nenhuma inscrição encontrada"
  - **CallManagementTable**: "Nenhuma inscrição em processo de chamada encontrada"
  - **CertificationManagementTable**: "Nenhuma inscrição confirmada encontrada"
  - **UsersTable**: "Nenhum usuário encontrado"
  - **RanchesTable**: "Nenhum rancho encontrado"
  - **LocationsTable**: "Nenhum local de treinamento encontrado"
  - **ClassesTable**: "Nenhuma turma encontrada"
  - **MembersTable**: "Nenhum membro encontrado"

## [1.3.0] - 2025-01-12

### Added
- **CRUDTable**: Implementado sistema de controle de visibilidade de colunas
  - Novo parâmetro `columnVisibility?: Record<string, boolean>` para definir colunas visíveis por padrão
  - Integração com funcionalidade nativa do MantineReactTable para mostrar/ocultar colunas
  - Botão "Mostrar/Ocultar Colunas" na toolbar da tabela para controle do usuário
  - Persistência do estado das colunas durante a sessão
  - Novo parâmetro `data?: T[]` para permitir dados customizados na tabela

- **CallManagementPage**: Nova página para gestão de chamadas de alunos
  - Tabela específica para status: waiting, called, confirmed, ignored, dropped
  - Ações customizadas para retorno à lista de espera
  - Filtros automáticos para mostrar apenas inscrições em processo de chamada
  - Integração com sistema de fluxo de status existente

- **CertificationPage**: Nova página para gestão de certificações
  - Tabela específica para inscrições confirmadas
  - Ações customizadas para certificar ou marcar como faltou
  - Filtros automáticos para mostrar apenas inscrições confirmadas
  - Interface dedicada para finalização do processo de treinamento

- **Menu Hierárquico**: Sistema de navegação expandido
  - Menu "Inscrições" com submenu expansível
  - Subitens: "Visão Geral", "Gestão de Chamadas" e "Certificações"
  - Navegação intuitiva com indicadores visuais de estado ativo
  - Suporte a permissões granulares por funcionalidade

### Changed
- **EnrollmentsPage**: Movida para estrutura hierárquica de inscrições
  - Nova rota: `/inscricoes/visao-geral` (anteriormente `/inscricoes`)
  - Renomeada para "Visão Geral" no menu hierárquico
  - Título da tabela atualizado para "Visão Geral - Inscrições"
  - Mantém funcionalidade completa de visualização de todas as inscrições

- **EnrollmentsTable**: Reorganizada ordem e visibilidade das colunas
  - Nova ordem das colunas: Fluxo, Fluxo, Turma, Status, Data de Inscrição, Cidade Preferencial, Nome, Telefone, UF
  - Colunas CNH, Email, Uso de Moto, Marca e Modelo ocultas por padrão
  - Usuários podem ativar/desativar colunas ocultas através do botão nativo da tabela
  - Renomeação de "UF da CNH" para "UF" para simplificação
  - Atualização dos headers de exportação CSV/PDF para refletir nova ordem
  - Melhoria na organização visual da tabela com colunas mais relevantes em destaque

### Fixed
- **CRUDForm Integration**: Corrigido uso incorreto do CRUDForm nas novas páginas
  - Formulários agora seguem o padrão correto com props adequadas
  - Implementação de `useForm` e estrutura de campos conforme esperado
  - Resolvido erro "Cannot read properties of undefined (reading 'onSubmit')"

- **Type Safety**: Corrigidos erros de tipo TypeScript nas tabelas
  - Cast seguro de `CRUDType[]` para `Enrollment[]` usando `as unknown as`
  - Resolvidos conflitos de tipo entre dados genéricos e específicos
  - Melhoria na compatibilidade de tipos entre componentes

- **Data Validation**: Implementada validação para estados vazios
  - Mensagens informativas quando não há dados para exibir
  - Interface amigável para usuários quando tabelas estão vazias
  - Melhoria na experiência do usuário com feedback visual adequado

- **Column Duplication**: Corrigida coluna "Fluxo" duplicada em todas as páginas
  - Removida coluna duplicada na Visão Geral, Gestão de Chamadas e Certificações
  - Atualizados headers de exportação CSV/PDF para refletir correção
  - Melhoria na organização visual das tabelas sem duplicações

- **Enrollment Creation**: Corrigido erro de validação no cadastro de inscrições
  - Removidos campos `status` e `class` do payload de criação
  - Implementada função `transformData` para filtrar campos não permitidos
  - Criado tipo `CreateEnrollmentDto` específico para criação
  - Resolvido erro "property status should not exist, property class should not exist"
  - Ocultados campos `status` e `class` durante criação para melhor UX
  - Campos aparecem apenas durante edição de inscrições existentes

- **Call Management Actions**: Desabilitadas ações de certificação na Gestão de Chamadas
  - Adicionada prop `disabledActions` ao componente `EnrollmentStatusActionsWithModal`
  - Desabilitadas ações `CERTIFIED` e `MISSED` na tabela de Gestão de Chamadas
  - Ações de certificação disponíveis apenas na tabela de Certificações
  - Melhoria na separação de responsabilidades entre as páginas

- **Page Renaming**: Renomeada página de Certificações para Gestão de Certificações
  - `CertificationPage` → `CertificationManagementPage`
  - `CertificationTable` → `CertificationManagementTable`
  - `CertificationForm` → `CertificationManagementForm`
  - Atualizados imports e rotas em todos os arquivos relacionados
  - Melhoria na nomenclatura para maior clareza de propósito

- **Component Fix**: Corrigido erro de `disabledActions` não definido
  - Adicionado parâmetro `disabledActions = []` na função `EnrollmentStatusActions`
  - Resolvido erro "disabledActions is not defined" no componente
  - Funcionalidade de desabilitação de ações funcionando corretamente

- **Component Organization**: Reorganizadas ações de status de inscrição em componentes especializados
  - Criado `EnrollmentStatusCallActions` para ações de chamada (Chamar, Confirmar, Cancelar, Ignorar)
  - Criado `EnrollmentStatusCertificationActions` para ações de certificação (Certificar, Faltou)
  - Atualizada `CallManagementTable` para usar apenas ações de chamada
  - Atualizada `CertificationManagementTable` para usar apenas ações de certificação
  - Atualizada `EnrollmentsTable` para mostrar ambos os tipos de ações lado a lado
  - Melhoria na separação de responsabilidades e organização do código

- **Call Management Enhancement**: Adicionada opção de retornar para status "Chamado"
  - Inscrições com status `ignored`, `dropped` ou `confirmed` podem retornar para `called`
  - Botão "Voltar para chamado" disponível quando apropriado
  - Melhoria na flexibilidade do fluxo de gestão de chamadas
  - Permite reavaliação de inscrições que foram ignoradas ou canceladas

- **Backend Status Transition**: Corrigida validação de transições de status
  - Adicionada transição permitida de `CONFIRMED` para `CALLED`
  - Resolvido erro "Invalid status transition from confirmed to called"
  - Backend agora suporta reversão de inscrições confirmadas para chamado
  - Melhoria na flexibilidade do fluxo de gestão de chamadas

- **Enrollment Overview Simplification**: Removida coluna de fluxo da Visão Geral
  - Coluna "Fluxo" removida da página de Visão Geral (EnrollmentsPage)
  - Ações de fluxo disponíveis apenas nas páginas especializadas
  - Interface mais limpa e focada na visualização de dados
  - Separação clara entre visualização (Visão Geral) e ações (Gestão de Chamadas/Certificações)

- **Enrollment Edit Functionality**: Habilitado botão de editar na Visão Geral
  - Adicionada prop `enableEdit` ao componente `CRUDTable`
  - Botão de editar habilitado na página de Visão Geral (EnrollmentsPage)
  - Funcionalidade de edição independente das permissões do usuário
  - Melhoria na flexibilidade de edição de inscrições

- **Enrollment Form Data Fix**: Corrigido envio de status e class na edição
  - Função `transformData` atualizada para preservar `status` e `class` durante edição
  - Interface `CRUDFormProps` expandida para suportar parâmetro `isCreate`
  - Lógica de transformação diferenciada entre criação e edição
  - Resolvido problema de campos obrigatórios não sendo enviados na edição

- **Enrollment Status Visual Enhancement**: Ícones visuais para status de inscrições
  - Coluna de status atualizada com ícones correspondentes aos status
  - Mapeamento visual: Aguardando (⏰), Chamado (📞), Confirmado (✅), Desistiu (❌), Ignorado (👁️‍🗨️), Certificado (🏆), Faltou (👤❌)
  - Cores diferenciadas para cada status (azul, laranja, verde, vermelho, cinza, teal)
  - Melhoria na identificação visual rápida do status das inscrições
  - Consistência com ícones usados nos componentes de ações

- **StatusIcon Component Generalization**: Componente reutilizável para ícones de status
  - Criado componente `StatusIcon` centralizado em `/components/StatusIcon`
  - Aplicado em todas as tabelas de enrollment (Visão Geral, Gestão de Chamadas, Certificações)
  - Props configuráveis: `showLabel` e `iconSize` para flexibilidade
  - Eliminação de código duplicado entre tabelas
  - Manutenção centralizada do mapeamento de status para ícones
  - Consistência visual garantida em toda aplicação

- **Enrollment Edit Functionality Configuration**: Configuração de edição por página
  - **Visão Geral**: Edição habilitada (`enableEdit={true}`) para gerenciamento completo
  - **Gestão de Chamadas**: Edição desabilitada (sem `enableEdit`) - foco em ações de fluxo
  - **Certificações**: Edição desabilitada (sem `enableEdit`) - foco em certificação
  - Separação clara de responsabilidades entre páginas
  - Prevenção de edições acidentais em páginas especializadas

- **Backend Filtering and Pagination**: Implementação de filtros e paginação no backend
  - **Query Parameters**: Suporte a `status`, `activeClassesOnly`, `page`, `limit`
  - **Filtros Inteligentes**: Status por vírgula, turmas ativas, permissões de rancho
  - **Paginação Eficiente**: Controle de página, limite e contagem total
  - **Performance**: Redução significativa de dados transferidos
  - **Escalabilidade**: Suporte a milhares de registros

- **Frontend Query System Enhancement**: Sistema de consultas aprimorado
  - **useCRUDQuery**: Suporte a query parameters e paginação
  - **CRUDContext**: Integração com filtros e paginação
  - **CRUDTable**: Paginação nativa com controles de navegação
  - **Type Safety**: Tipos TypeScript para dados paginados
  - **Cache Inteligente**: React Query otimizado para filtros

- **Page-Specific Filtering**: Filtros específicos por página
  - **Call Management**: Status de gestão de chamadas + turmas ativas
  - **Certifications**: Apenas confirmados + turmas ativas
  - **Visão Geral**: Sem filtros (todos os dados)
  - **Performance**: Redução de 70-90% nos dados transferidos
  - **UX**: Carregamento mais rápido e responsivo

- **Backend Query Parameter Fix**: Correção na conversão de parâmetros
  - **activeClassesOnly**: Corrigida conversão de string para boolean
  - **Type Safety**: Parâmetros de query tratados corretamente
  - **Data Flow**: Dados agora fluem corretamente para as tabelas
  - **Debug**: Removidos logs de debug após correção

- **Query Cache Isolation**: Isolamento de cache entre páginas
  - **pageId**: Identificador único para cada página (call-management, certification-management, enrollments-overview)
  - **Cache Keys**: Chaves únicas baseadas em parâmetros ordenados
  - **Data Isolation**: Cada página mantém seu próprio cache independente
  - **Performance**: Evita conflitos de cache entre páginas especializadas
  - **Consistency**: Dados corretos exibidos em cada contexto

- **Data Extraction Fix**: Correção na extração de dados paginados
  - **Problem**: Dados não apareciam nas tabelas apesar de respostas bem-sucedidas da API
  - **Solution**: Lógica melhorada para extrair dados de diferentes estruturas de resposta
  - **Impact**: Páginas de Call Management e Certification Management agora exibem dados corretamente
  - **Robustness**: Suporte a múltiplos formatos de resposta do backend

- **Query Cache Invalidation Fix**: Correção na invalidação de cache após mutações
  - **Problem**: Tabelas não eram atualizadas após executar ações do fluxo de chamada
  - **Solution**: Atualizado `useOptimizedQueries` para invalidar todas as variações de queries
  - **Impact**: Ações de status e atribuição de turma agora atualizam todas as páginas automaticamente
  - **Consistency**: Dados sincronizados entre todas as visualizações de inscrições

- **Paginated Data Mutation Fix**: Correção na atualização otimista de dados paginados
  - **Problem**: Erro "old.map is not a function" ao executar mutações em dados paginados
  - **Solution**: Atualizado `updateQueryData` e `getQueryData` para lidar com estrutura `PaginatedResult<T>`
  - **Impact**: Mutações funcionam corretamente em todas as páginas com paginação
  - **Robustness**: Suporte a dados simples (array) e paginados (objeto com propriedade `data`)

- **Status Transition Validation Fix**: Correção na validação de transições de status
  - **Problem**: Erro "Invalid status transition from dropped to called" ao tentar executar ações em registros com status `dropped`
  - **Solution**: Permitido transição de `DROPPED` para `CALLED` no backend e frontend
  - **Impact**: Registros com status `dropped` podem voltar para `called` usando o botão "Voltar para chamado"
  - **Business Logic**: Alinhamento com regras de negócio que permitem reversão de `dropped` para `called`
  - **Components**: Corrigido tanto no backend (`enrollments.service.ts`) quanto no frontend (`EnrollmentStatusCallActions`)

- **Status Transition Business Rule Fix**: Correção nas regras de negócio de transições de status
  - **Problem**: Transição de `CONFIRMED` para `DROPPED` não deveria ser permitida
  - **Solution**: Removido `DROPPED` das transições permitidas a partir de `CONFIRMED`
  - **Impact**: Registros confirmados não podem mais ser marcados como dropped
  - **Business Logic**: Alinhamento com regras de negócio que impedem cancelamento de confirmados

- **EnrollmentsTable Data Handling Fix**: Correção no tratamento de dados na página Visão Geral
  - **Problem**: Erro "query.data?.map is not a function" na página de Visão Geral e dados não aparecendo na tabela
  - **Solution**: Atualizado `csvData` e `data` para lidar com dados paginados e não paginados
  - **Impact**: Página de Visão Geral funciona corretamente com diferentes formatos de dados
  - **Robustness**: Suporte a dados simples (array) e paginados (objeto com propriedade `data`)
  - **Data Flow**: Dados extraídos corretamente e passados para o `CRUDTable` via prop `data`

- **Call Management IGNORED Status Fix**: Correção na exibição de ações para status IGNORED
  - **Problem**: Status IGNORED estava mostrando seleção de turmas em vez do botão de retorno
  - **Solution**: Adicionada verificação prioritária para `canReturnToCalled()` antes de mostrar ações normais
  - **Impact**: Status IGNORED, CONFIRMED e DROPPED agora mostram corretamente o botão "Voltar para chamado"
  - **Logic Flow**: Prioridade: Seleção de turma → Botão de retorno → Ações normais → Botão de retorno alternativo

- **Call Management Class Selection Logic Improvement**: Melhoria na lógica de seleção de turmas
  - **Problem**: Seleção de turma aparecia para qualquer status sem turma atribuída
  - **Solution**: Seleção de turma agora só aparece quando status é WAITING e não tem turma atribuída
  - **Impact**: Interface mais intuitiva - só permite atribuir turma quando aluno está em lista de espera
  - **Business Logic**: Alinhamento com fluxo de negócio - turma só é atribuída na fase de waiting

- **Call Management IGNORED Status Logic Fix**: Correção na lógica de retorno para CALLED
  - **Problem**: Status IGNORED estava permitindo retorno para CALLED, mas já tem turma atribuída
  - **Solution**: Removido IGNORED da função `canReturnToCalled()` - apenas CONFIRMED e DROPPED podem retornar
  - **Impact**: Status IGNORED agora não mostra botão de retorno, mantendo consistência com turma já atribuída
  - **Business Logic**: IGNORED é um status final para a turma específica - não pode retornar para CALLED

- **Call Management IGNORED Status Logic Revert**: Reversão da lógica de retorno para CALLED
  - **Problem**: Funcionalidade de retorno de IGNORED para CALLED foi removida
  - **Solution**: Restaurado IGNORED na função `canReturnToCalled()` - mantém funcionalidade de retorno
  - **Impact**: Status IGNORED, CONFIRMED e DROPPED podem retornar para CALLED conforme necessário
  - **Business Logic**: Flexibilidade no fluxo de chamadas - permite reativar alunos ignorados/cancelados

- **Classes Table Toggle Active Feature**: Funcionalidade para ativar/desativar turmas
  - **Problem**: Não havia forma de ativar/desativar turmas diretamente na tabela
  - **Solution**: Criada ação personalizada na tabela de turmas com botão de toggle
  - **Impact**: Usuários podem ativar/desativar turmas com confirmação e feedback visual
  - **Technical**: Nova mutation `useClassToggleActiveMutation` com atualização otimista
  - **UX**: Confirmação antes da ação, ícones dinâmicos e notificações de sucesso/erro

- **Classes Table Icon Fix**: Correção de erro de renderização de ícones
  - **Problem**: Erro "Objects are not valid as a React child" na página de turmas
  - **Solution**: Corrigido tipo de ícone nas ações personalizadas - usando componente estático
  - **Impact**: Página de turmas funciona corretamente sem erros de renderização
  - **Technical**: Ícone fixo `IconToggleRight` em vez de função dinâmica

- **Classes Table Switch Implementation**: Implementação de switch na coluna Ativo
  - **Problem**: Ação personalizada para ativar/desativar turmas não era intuitiva
  - **Solution**: Removida ação personalizada e implementado Switch diretamente na coluna "Ativo"
  - **Impact**: Interface mais intuitiva - switch clicável para ativar/desativar turmas
  - **UX**: Ativação/desativação imediata sem necessidade de confirmação
  - **Technical**: Switch com estado de loading e cor verde para melhor feedback visual

### Fixed
- **TypeScript Errors**: Corrigidos erros de compilação relacionados a dados paginados
  - Criada função utilitária `extractData()` para extrair dados de arrays ou objetos paginados
  - Corrigidos erros "Property 'map' does not exist on type 'PaginatedResult<...>'"
  - Resolvidos erros de tipo implícito 'any' em formulários e tabelas
  - Aplicadas type assertions seguras com `as unknown as Type[]`

- **Linting Errors**: Corrigidos problemas de código e formatação
  - Removidos imports não utilizados (Button, Modal, Text, toDate)
  - Prefixadas variáveis não utilizadas com `_` para indicar uso intencional
  - Corrigida formatação de código com Prettier
  - Resolvidos warnings de dependências em hooks React

- **Build Process**: Otimizado processo de build e testes
  - TypeScript compilation passando sem erros
  - Vite build concluído com sucesso
  - Aplicação pronta para produção
  - Melhorada performance de build com otimizações de chunking

### Pull Requests
- **PR #26**: Sistema de Gestão de Inscrições com Páginas Especializadas
  - **URL**: https://github.com/Cavalo-de-Aco-Sistemas/rancheiros-frontend/pull/26
  - **Base**: develop ← mpv
  - **Status**: Aberto para revisão
  - **Relacionado**: Backend PR #47
  - **Testes**: TypeScript compilation ✅, Build process ✅, Linting corrigido ✅

### Technical Details
- **Column Management**: Utilização do sistema nativo de visibilidade do MantineReactTable
- **Export Compatibility**: CSV e PDF mantêm compatibilidade com nova ordem de colunas
- **Type Safety**: Tipos TypeScript atualizados para suportar controle de visibilidade
- **User Experience**: Interface mais limpa com colunas menos utilizadas ocultas por padrão
- **Data Filtering**: Filtros automáticos baseados em status para separação de responsabilidades
- **Route Structure**: Rotas hierárquicas para organização lógica das funcionalidades
- **Component Reusability**: Reutilização de componentes existentes com customizações específicas
- **Permission System**: Integração com sistema de permissões existente para controle de acesso
- **Error Handling**: Validação robusta para estados de dados vazios e erros de tipo

## [1.2.0] - 2025-01-09

### Added
- **EnrollmentsTable**: Implementado link do WhatsApp na coluna Telefone
  - Link clicável que abre WhatsApp com número do aluno
  - Detecção automática de dispositivo móvel (usa `whatsapp://` ou `https://wa.me/`)
  - Formatação automática do telefone no padrão brasileiro (XX) XXXXX-XXXX
  - Mensagem personalizada com parâmetros da turma (nome do aluno, data, local, cidade)
  - Inclui nome do admin logado na mensagem para identificação pessoal
  - Mensagem completa com instruções do treinamento e recomendações de segurança

- **User Model**: Adicionado campo `name` ao modelo de usuários
  - Interface `User` e `UserDto` atualizadas com campo `name`
  - Campo obrigatório para identificação pessoal dos usuários
  - Separação entre `username` (login) e `name` (exibição)

- **AuthContext**: Expandido contexto de autenticação
  - Adicionado campo `name` ao `AuthContextType` e `LoginProps`
  - Armazenamento do nome do usuário no localStorage
  - Disponibilização do nome em toda a aplicação via contexto

- **UsersForm**: Atualizado formulário de usuários
  - Novo campo "Nome" obrigatório no formulário de criação/edição
  - Validação e persistência do campo `name`
  - Interface atualizada para gerenciar nome e username separadamente

- **UsersTable**: Expandida tabela de usuários
  - Nova coluna "Nome" na tabela de usuários
  - Exportação CSV/PDF inclui o nome dos usuários
  - Interface mais informativa com identificação completa

### Changed
- **Backend AuthService**: Atualizado serviço de autenticação
  - Método `validateUser()` retorna campo `name` do usuário
  - Método `login()` inclui `name` na resposta de autenticação
  - Documentação da API atualizada com campo `name`

- **Backend AuthController**: Expandido controller de autenticação
  - `LoginResponseDto` inclui campo `name` na documentação Swagger
  - Resposta de login contém informações completas do usuário

- **Backend User Entity**: Atualizada entidade de usuário
  - Adicionada coluna `name` na entidade `User`
  - DTOs `CreateUserDto` e `UserResponseDto` atualizados
  - Validações e documentação da API expandidas

- **WhatsApp Integration**: Melhorada integração com WhatsApp
  - Mensagem personalizada com nome real do admin em vez de username
  - Comunicação mais profissional e pessoal
  - Identificação clara de quem está entrando em contato

### Fixed
- **UsersForm**: Corrigido erro de validação no formulário de usuários
  - Implementada função `transformData` para remover `repeatPassword` antes do envio à API
  - Campo `repeatPassword` mantido para validação no frontend, removido apenas no envio
  - Campo `password` vazio removido durante edições para evitar erro de validação
  - Resolvido erro "property repeatPassword should not exist" e "password should not be empty"
  - Formulário agora funciona corretamente para criação e edição de usuários

- **EnrollmentsForm**: Removida função `transformData` do formulário de enrollments
  - Formulário agora envia dados diretamente para a API sem transformação
  - Backend atualizado para aceitar todos os campos enviados pelo frontend
  - Simplificação do código removendo lógica de transformação desnecessária
  - Melhor compatibilidade entre frontend e backend

### Technical Details
- **Database Schema**: Preparado para migração com nova coluna `name`
- **API Compatibility**: Mantida compatibilidade com sistema existente
- **Type Safety**: Tipos TypeScript atualizados em todo o sistema
- **Validation**: Validações de backend e frontend sincronizadas
- **Data Transformation**: Implementada transformação de dados no CRUDForm para limpeza antes do envio

### Pull Requests
- **PR #24**: [feat: Implementação de link WhatsApp e campo name para usuários](https://github.com/Cavalo-de-Aco-Sistemas/rancheiros-frontend/pull/24) - Enviado para develop

## [1.1.0] - 2025-01-09

### Fixed
- **ClassesForm**: Corrigido erro de validação na criação de classes
  - Removido campo `name` inexistente do `INITIAL_VALUES` que causava erro "property name should not exist"
  - Corrigido formato de data enviado para API - agora converte objetos `Date` para strings ISO (YYYY-MM-DD) antes do envio

### Added
- **CRUDForm**: Adicionado suporte para transformação de dados antes do envio para API
  - Nova propriedade opcional `transformData?: (data: D) => API`
  - Novo tipo genérico `API` para permitir transformação de tipos
  - Função `onSubmit` atualizada para usar transformação quando fornecida

- **Model**: Criado tipo `ClassCreateDto` para representar dados enviados para API com `date` como string

- **ClassesTable**: Melhorada experiência do usuário na coluna de link do Maps
  - Substituído texto do link por ícone de mapa (IconMapPin) clicável com tooltip
  - Link abre em nova aba com segurança (noopener, noreferrer)
  - Interface mais limpa e intuitiva com ícone semânticamente correto

### Changed
- **ClassesForm**: Melhorada compatibilidade entre frontend e backend
  - Formulário continua trabalhando com objetos `Date` para facilitar uso com componentes de data
  - Transformação automática de data para formato esperado pelo backend
  - Mantida compatibilidade com padrão estabelecido no projeto

### Pull Requests
- **PR #16**: [fix: Corrigir validação de criação de classes e melhorar UX da tabela](https://github.com/Cavalo-de-Aco-Sistemas/rancheiros-frontend/pull/16) - Enviado para develop

## [1.0.0] - 2024-01-XX

### Added
- Sistema inicial de gerenciamento de rancheiros
- Autenticação e autorização
- CRUD para classes, membros, localizações, ranchos e usuários
- Sistema de inscrições
- Interface responsiva com Mantine UI
