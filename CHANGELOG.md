# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Fixed
- **ClassesForm**: Corrigido erro de validação na criação de classes
  - Removido campo `name` inexistente do `INITIAL_VALUES` que causava erro "property name should not exist"
  - Corrigido formato de data enviado para API - agora converte objetos `Date` para strings ISO (YYYY-MM-DD) antes do envio
  - Adicionado suporte para transformação de dados no componente `CRUDForm` com novo tipo genérico `API`
  - Criado tipo `ClassCreateDto` para representar dados enviados para API com `date` como string

### Added
- **CRUDForm**: Adicionado suporte para transformação de dados antes do envio para API
  - Nova propriedade opcional `transformData?: (data: D) => API`
  - Novo tipo genérico `API` para permitir transformação de tipos
  - Função `onSubmit` atualizada para usar transformação quando fornecida

### Changed
- **ClassesForm**: Melhorada compatibilidade entre frontend e backend
  - Formulário continua trabalhando com objetos `Date` para facilitar uso com componentes de data
  - Transformação automática de data para formato esperado pelo backend
  - Mantida compatibilidade com padrão estabelecido no projeto

## [1.0.0] - 2024-01-XX

### Added
- Sistema inicial de gerenciamento de rancheiros
- Autenticação e autorização
- CRUD para classes, membros, localizações, ranchos e usuários
- Sistema de inscrições
- Interface responsiva com Mantine UI
