# Rancheiros Frontend

## setup env

```.env
VITE_BACKEND_ADDRESS=http://localhost:3000
```

## Code Features

This project comes with the following features:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/) - UI component development and testing
- [Vitest](https://vitest.dev/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) - Unit tests
- [Playwright](https://playwright.dev/) - End-to-end testing
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [GraphQL](https://graphql.org/) - API communication

## yarn scripts

### Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

#### E2E Testing (Playwright)

- `test:e2e` – runs Playwright E2E tests in headless mode
- `test:e2e:ui` – runs Playwright tests with UI mode
- `test:e2e:headed` – runs Playwright tests with visible browser

**E2E Test Configuration:**

Create a `.env.test` file for custom test credentials (optional):

```bash
E2E_USERNAME=admin
E2E_PASSWORD=12345
E2E_FRONTEND_URL=http://localhost:5173
E2E_BACKEND_URL=http://localhost:3000
```

If not provided, defaults are used (admin/12345).

See [e2e/README.md](e2e/README.md) for detailed E2E testing documentation.

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

## Testing

This project uses multiple testing approaches:

### 1. Unit Tests (Vitest)
Fast unit tests for utility functions and hooks.

```bash
npm run vitest        # Run tests once
npm run vitest:watch  # Run tests in watch mode
```

### 2. Component Testing (Storybook)
Visual testing and documentation for UI components.

```bash
npm run storybook     # Start Storybook dev server
```

**Available Stories:**
- `PermissionRow` - Tests permission icons with null safety
- `StatusIcon` - Tests all enrollment status icons
- `Logo` - Tests logo in different sizes
- `PasswordStrength` - Tests password validation
- `OfflineIndicator` - Tests offline detection

### 3. E2E Tests (Playwright)
End-to-end tests for complete user flows.

```bash
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui  # Run with UI mode
```

**Test Files:**
- `e2e/auth.spec.ts` - Authentication tests
- `e2e/members-crud.spec.ts` - Members CRUD flow tests
- `e2e/simple-test.spec.ts` - Basic connectivity tests

For detailed E2E testing documentation, see [e2e/README.md](e2e/README.md).

## Development Workflow

1. **Start Backend**: Make sure the backend is running on `http://localhost:3000`
2. **Start Frontend**: `npm run dev`
3. **Run Tests**: Use the scripts above to run different test types
4. **Storybook**: Open `http://localhost:6006` to view components

## GraphQL

This project uses GraphQL for all API communication via Apollo Client. The backend is completely migrated from REST to GraphQL.

**Key Features:**
- Automatic cache management
- Optimistic updates
- Real-time subscriptions (if needed)
- Type-safe queries and mutations

## Deployment (Coolify + Docker)

This is a SPA using `react-router-dom` `createBrowserRouter`. In production, the web server must rewrite all unknown routes to `index.html` to support page refresh and deep links.

### Nginx config (recommended)

Add a server block with SPA fallback:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Static assets cached by fingerprint
    location ~* \.(?:css|js|woff2?|ttf|otf|eot|gif|jpg|jpeg|png|svg)$ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }
}
```

Example Dockerfile serving the Vite `dist` via Nginx:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
# If you keep nginx.conf in project root, uncomment next line
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

If you deploy under a subpath (e.g. `https://example.com/app`), set the Vite base in `vite.config.mjs`:

```ts
export default defineConfig({ base: '/app/', /* ... */ })
```

### Troubleshooting
- Refresh returns 404 on non-root routes: ensure SPA fallback (`try_files $uri /index.html;`) is configured.
- White screen on refresh behind proxy: verify `root` points to the built `dist` directory.
