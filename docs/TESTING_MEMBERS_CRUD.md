# Teste de Fluxo Completo - CRUD de Membros

## 🎯 Objetivo
Testar o fluxo completo de criação, edição e exclusão de um membro na UI.

## ✅ Pré-requisitos

- [x] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Usuário logado com permissões adequadas

---

## 📝 Fluxo de Teste

### 1. **LOGIN**
1. Acesse `http://localhost:5173`
2. Faça login com credenciais:
   - Usuário: `admin` (ou o seu usuário)
   - Senha: (sua senha)
3. Verifique se login foi bem-sucedido

---

### 2. **NAVEGAÇÃO PARA PÁGINA DE MEMBROS**
1. No menu lateral, clique em "Membros"
2. Verifique se a página carrega sem erros
3. Verifique se a tabela de membros é exibida

---

### 3. **CRIAR NOVO MEMBRO**
1. Clique no botão "Adicionar Membro" (botão de "+")
2. Preencha o formulário com os seguintes dados:
   - **Nome**: "Teste Member GraphQL"
   - **Patch**: "TST"
   - **Rancho**: Selecione um rancho existente
   - **Fase**: Selecione "prospect"
   - **Data de Nascimento**: Ex: 01/01/1990
   - **Telefone**: Ex: (41) 99999-9999
   - **Sangue**: Ex: "O+"
   - **Residência**: Ex: "Curitiba - PR"
   - **Responsabilidade**: Ex: "Prospecto"
3. Clique em "Salvar"
4. ✅ **Verificação**: 
   - Notificação de sucesso deve aparecer
   - Tabela de membros deve atualizar automaticamente
   - Novo membro deve aparecer na lista

---

### 4. **EDITAR MEMBRO CRIADO**
1. Localize o membro criado na tabela ("Teste Member GraphQL")
2. Clique no botão de editar (ícone de lápis)
3. Altere os seguintes campos:
   - **Patch**: "TEST"
   - **Fase**: Mude para "halfpatch"
   - **Data Half Patch**: Hoje
4. Clique em "Salvar"
5. ✅ **Verificação**:
   - Notificação de sucesso deve aparecer
   - Tabela deve atualizar com as mudanças
   - Patch deve mostrar "TEST"
   - Fase deve mostrar "halfpatch"

---

### 5. **DELETAR (SOFT DELETE) MEMBRO**
1. Localize o membro criado na tabela
2. Clique no botão de deletar (ícone de lixeira)
3. Confirme a exclusão
4. ✅ **Verificação**:
   - Notificação de sucesso deve aparecer
   - Membro deve desaparecer da lista
   - Membro foi "soft deleted" (não deletado permanentemente)

---

## 🐛 Problemas Potenciais e Como Testar

### Problema 1: "Cannot read properties of null"
**Causa**: Permissões null no usuário  
**Como testar**: Fazer login e verificar se a página de membros carrega sem erros  
**Solução**: Backend deve retornar permissões válidas ou usar fallback

### Problema 2: Erro de GraphQL na mutation
**Causa**: Schema GraphQL não corresponde ao que é enviado  
**Como testar**: Tentar criar membro e verificar erro no console  
**Solução**: Verificar logs do backend para detalhes do erro

### Problema 3: Não atualiza após criação/edição
**Causa**: `refetchQueries` não configurado  
**Como testar**: Criar membro e verificar se aparece na lista  
**Solução**: Mutation deve ter `refetchQueries: [{ query: GET_MEMBERS }]`

### Problema 4: Campos de data inválidos
**Causa**: Formato de data incorreto  
**Como testar**: Tentar salvar com datas em formato errado  
**Solução**: Frontend deve validar formato antes de enviar

---

## ✅ Checklist de Teste

- [ ] Login funciona
- [ ] Navegação para Membros funciona
- [ ] Tabela de membros carrega
- [ ] Botão "Adicionar" funciona
- [ ] Formulário de criação abre
- [ ] Validação de campos obrigatórios funciona
- [ ] Criação de membro funciona
- [ ] Notificação de sucesso aparece
- [ ] Tabela atualiza após criação
- [ ] Botão de editar funciona
- [ ] Formulário de edição preenche com dados corretos
- [ ] Edição funciona
- [ ] Tabela atualiza após edição
- [ ] Botão de deletar funciona
- [ ] Confirmação de exclusão aparece
- [ ] Exclusão funciona (soft delete)
- [ ] Membro some da lista após exclusão

---

## 📊 Resultados Esperados

### Criar Membros
- ✅ Mutation GraphQL enviada com sucesso
- ✅ Resposta do backend recebida
- ✅ Cache do Apollo Client atualizado
- ✅ UI atualizada automaticamente

### Editar Membros
- ✅ Query GraphQL para buscar membro funciona
- ✅ Formulário preenche corretamente
- ✅ Mutation de update funciona
- ✅ UI reflete mudanças imediatamente

### Deletar Membros
- ✅ Mutation de delete funciona (soft delete)
- ✅ Membro desaparece da lista
- ✅ Membro ainda existe no banco (deleted: true)

---

## 🔍 Pontos de Verificação Adicionais

1. **Performance**: Operações devem completar em < 2 segundos
2. **UX**: Loading states devem aparecer durante operações
3. **Error Handling**: Erros devem exibir mensagens claras
4. **Validation**: Campos obrigatórios devem ser validados
5. **Permissions**: Usuários sem permissão não devem ver botões de ação

---

## 📝 Notas de Teste

Execute este fluxo e documente:
- ⏱️ Tempo de execução de cada operação
- 🐛 Erros encontrados
- ✅ Funcionalidades que funcionam perfeitamente
- 💡 Sugestões de melhoria

---

**Última Atualização**: 27 de Outubro de 2024  
**Versão do Frontend**: PR #37  
**Versão do Backend**: PR #58
