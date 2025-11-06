# 🧪 Teste UI - CRUD de Membros

## 🚀 Inicie os Servidores

```bash
# Terminal 1 - Backend
cd /Users/ggarciabas/Documents/GitHub/rancheiros-backend
npm run start:dev

# Terminal 2 - Frontend
cd /Users/ggarciabas/Documents/GitHub/rancheiros-frontend
npm run dev
```

## 📝 Teste Manual - Passo a Passo

### 1️⃣ **ACESSE O SISTEMA**
1. Abra `http://localhost:5173`
2. Login: `admin` / Password: `12345`

---

### 2️⃣ **CRIAR MEMBRO**
1. Clique em **"Membros"** no menu
2. Clique no botão **"+"** (Adicionar)
3. Preencha:
   - Nome: `Teste UI GraphQL`
   - Patch: `TST`
   - Rancho: Selecione um rancho
   - Fase: `Prospect`
   - Telefone: `(41) 99999-9999`
   - Residência: `Curitiba`
4. Clique em **"Salvar"**
5. ✅ Verifique: Notificação de sucesso aparece

---

### 3️⃣ **EDITAR MEMBRO**
1. Na tabela, localize "Teste UI GraphQL"
2. Clique no ícone de **lápis** (editar)
3. Altere:
   - Patch: `TEST2`
   - Fase: `Meio-escudo`
4. Clique em **"Salvar"**
5. ✅ Verifique: Mudanças aparecem na tabela

---

### 4️⃣ **DELETAR MEMBRO**
1. Na tabela, localize "Teste UI GraphQL"
2. Clique no ícone de **lixeira** (deletar)
3. Confirme a exclusão
4. ✅ Verifique: Membro some da lista

---

## 🐛 Problemas Comuns

### Erro: "Cannot read properties of null"
**Causa**: Permissões null  
**Solução**: Backend retorna permissões default

### Erro: "Network error"
**Causa**: Backend não está rodando  
**Solução**: Verificar se `npm run start:dev` está rodando

### Botão não aparece
**Causa**: Sem permissão  
**Solução**: Verificar permissões do usuário logado

---

## ✅ Checklist Completo

- [ ] Login funciona
- [ ] Página de Membros carrega
- [ ] Tabela mostra membros
- [ ] Criar membro funciona
- [ ] Editar membro funciona
- [ ] Deletar membro funciona
- [ ] Nenhum erro no console
- [ ] Performance ok (< 2s)
