# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

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
