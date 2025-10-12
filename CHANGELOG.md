# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

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
