---
name: run
description: "Launch the Rancheiros admin frontend (Vite + React + Mantine) locally in this container, from a fresh clone. Use when asked to run, start, or screenshot the frontend, or the full stack (backend + frontend). Requires the rancheiros-backend to be running first — see that repo's own .claude/skills/run/SKILL.md."
---

# Running rancheiros-frontend locally

Vite + React admin app, talks to the GraphQL backend over
`VITE_BACKEND_ADDRESS`. It has no backend of its own — **start
`rancheiros-backend` first** (see its `.claude/skills/run/SKILL.md` for
provisioning local Postgres, since the Docker daemon is not available in
this container).

## 1. Write `.env`

`.env.example` at the repo root has the one variable needed:

```bash
echo "VITE_BACKEND_ADDRESS=http://localhost:3000" > .env
```

(`env.test.example` is unrelated — it's Playwright e2e config, not app env.)

## 2. Install and start

The repo uses Yarn (`packageManager: yarn@4.5.0` in package.json), but
`npm install` also works if yarn isn't set up:

```bash
yarn install        # or: npm install
yarn dev --host      # vite; --host so it's reachable outside localhost if needed
```

Ready in under a second — Vite prints `Local: http://localhost:5173/`.

## 3. Verify it's actually working (not just that it launched)

Launching proves the dev server bound to a port. To confirm the app itself
works, log in through it — the backend seeds `admin` / `12345` via
`sql/first_user.sql` (see backend skill):

```js
// with playwright, executablePath: '/opt/pw-browsers/chromium-*/chrome-linux/chrome'
await page.goto('http://localhost:5173/');
const inputs = await page.$$('input');
await inputs[0].fill('admin');
await inputs[1].fill('12345');
await page.click('button:has-text("Entrar")');
```

A successful login lands on the dashboard ("PRÓXIMAS TURMAS" table). If the
login form just sits there or errors, the backend probably isn't reachable
at `VITE_BACKEND_ADDRESS` — check it's actually running on :3000 first.
