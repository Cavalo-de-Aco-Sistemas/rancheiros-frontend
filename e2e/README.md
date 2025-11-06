# Playwright E2E Tests

## 🚀 Início Rápido

### 1. Configurar credenciais de teste (opcional)

Crie um arquivo `.env.test` na raiz do projeto:

```bash
# .env.test
E2E_USERNAME=admin
E2E_PASSWORD=12345
E2E_FRONTEND_URL=http://localhost:5173
E2E_BACKEND_URL=http://localhost:3000
```

Se não criar o arquivo, os defaults serão usados (admin/12345).

### 2. Instalar dependências (se necessário)
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 3. Rodar os testes

```bash
# Rodar todos os testes (headless)
npm run test:e2e

# Rodar com UI interativa
npm run test:e2e:ui

# Rodar com navegador visível (headed)
npm run test:e2e:headed

# Rodar um arquivo específico
npx playwright test e2e/auth.spec.ts
```

## 📁 Estrutura

```
e2e/
├── auth.spec.ts              # Testes de autenticação
├── members-crud.spec.ts      # Testes de CRUD de membros
├── simple-test.spec.ts       # Testes básicos de conectividade
├── helpers/
│   └── auth.ts               # Helpers de autenticação
└── README.md                 # Este arquivo
```

## 🔐 Autenticação

O Playwright inclui um helper de autenticação que faz login automaticamente:

```typescript
import { login } from './helpers/auth';

test('my test', async ({ page }) => {
  await login(page); // Faz login como 'admin' por padrão
  
  // Agora você está autenticado e pode testar as páginas protegidas
});
```

### Customizar credenciais

```typescript
await login(page, 'myuser', 'mypassword');
```

## 📝 Exemplos de Testes

### Teste de Autenticação
```typescript
test('should login successfully', async ({ page }) => {
  await login(page);
  expect(await isLoggedIn(page)).toBe(true);
});
```

### Teste de CRUD
```typescript
test('should create a new member', async ({ page }) => {
  await login(page);
  
  await page.goto('http://localhost:5173/members');
  await page.click('button:has-text("Adicionar")');
  // ... preencher formulário
});
```

## 🐛 Debugging

### Ver o navegador durante o teste
```bash
npx playwright test --headed
```

### Abrir DevTools
```typescript
await page.pause(); // Pausa o teste e abre Playwright Inspector
```

### Ver screenshots em caso de falha
Os screenshots são salvos automaticamente em `test-results/`

### Ver trace de execução
```bash
npx playwright show-trace test-results/path/to/trace.zip
```

## ⚙️ Configuração

O arquivo `playwright.config.ts` contém:
- **webServer**: Inicia o frontend automaticamente antes dos testes
- **baseURL**: Configurado para `http://localhost:5173`
- **trace**: Habilitado para debug
- **retries**: 2 tentativas em CI

## 🔍 Troubleshooting

### Erro: "Timeout waiting for selector"
**Causa**: Elemento não aparece  
**Solução**: Aumentar timeout ou verificar se elemento existe

### Erro: "Page.goto: net::ERR_CONNECTION_REFUSED"
**Causa**: Frontend não está rodando  
**Solução**: Verificar se `npm run dev` está ativo ou deixar o Playwright gerenciar isso

### Erro: "element not found"
**Causa**: Selector mudou  
**Solução**: Usar Playwright Inspector para encontrar o seletor correto

## 📊 Reports

### HTML Report
Após rodar os testes, você pode ver o relatório HTML:
```bash
npx playwright show-report
```

### CI/CD
Para CI/CD, o Playwright gera reports automaticamente que podem ser publicados.

## ✅ Best Practices

1. **Usar helpers**: Criar funções reutilizáveis para ações comuns
2. **Aguardar elementos**: Sempre usar `waitForSelector` ou `toBeVisible()`
3. **Isolar testes**: Cada teste deve ser independente
4. **Limpar dados**: Considerar limpar dados de teste após cada teste
5. **Usar fixtures**: Playwright fixtures para setup/teardown

## 🌍 Variáveis de Ambiente

O Playwright permite configuração via variáveis de ambiente:

| Variável | Default | Descrição |
|----------|---------|-----------|
| `E2E_USERNAME` | `admin` | Usuário para login nos testes |
| `E2E_PASSWORD` | `12345` | Senha para login nos testes |
| `E2E_FRONTEND_URL` | `http://localhost:5173` | URL do frontend |
| `E2E_BACKEND_URL` | `http://localhost:3000` | URL do backend |

### Usar variáveis

```bash
# Via arquivo .env.test
E2E_USERNAME=myuser E2E_PASSWORD=mypass npm run test:e2e

# Via linha de comando
E2E_USERNAME=testuser npm run test:e2e

# No CI/CD
E2E_USERNAME=$CI_USERNAME E2E_PASSWORD=$CI_PASSWORD npm run test:e2e
```

## 📚 Documentação

- [Playwright Docs](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Selectors](https://playwright.dev/docs/selectors)
