# Task submission

Full-stack app: **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, **Prisma**, **PostgreSQL** (Neon-ready), **NextAuth.js (Auth.js v5)** with credentials. Users sign up, log in, submit predefined tasks, and view history.

## Features

- Sign up / log in / log out  
- **Stay logged in** after closing the browser or tab (session cookie uses `Max-Age`, default **30 days**); **Logout** still clears the session immediately  
- Protected dashboard, tasks, and history (`src/proxy.ts` + layout guard)  
- Task checkboxes → saved to Postgres with user id, display name, and timestamp  
- History table sorted newest-first  

## Requirements

- **Node.js** 20+ recommended  
- **npm** (or compatible package manager)  
- **Neon** (or any Postgres host) database URLs  
- Network access to Postgres **port 5432** for migrations from your machine (or run `migrate deploy` in CI / Vercel)

---

## Local setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   `postinstall` runs `prisma generate` (needed for `@prisma/client`).

3. **Environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` (and optionally `.env.local` for overrides). See **Environment variables** below.

4. **Database schema**

   First time (development):

   ```bash
   npm run db:migrate
   ```

   You will be prompted for a migration name if Prisma creates a new migration. If you only want to push the schema without migration files:

   ```bash
   npm run db:push
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Pooled Postgres URL (Neon **pooler** host). |
| `DIRECT_URL` | Yes | Direct Postgres URL for Prisma Migrate (Neon **non-pooler** host). |
| `AUTH_SECRET` | Yes | Secret for signing sessions. Generate: `openssl rand -base64 32` |
| `AUTH_URL` | Yes | App base URL. Local: `http://localhost:3000`. Production: `https://your-domain.com` |

Copy `.env.example` and fill in values. Do **not** commit `.env` or `.env.local`.

---

## Prisma commands

| Command | Purpose |
|---------|---------|
| `npm run db:generate` | Regenerate Prisma Client (`prisma generate`). |
| `npm run db:migrate` | Create/apply migrations in dev (`migrate dev`; loads `.env` + `.env.local`). |
| `npm run db:migrate:deploy` | Apply existing migrations (production / CI). |
| `npm run db:push` | Push schema without migration files (prototyping). |
| `npm run db:studio` | Open Prisma Studio. |
| `npm run db:validate` | Validate `schema.prisma`. |

Raw `npx prisma` only loads `.env` by default—put `DATABASE_URL` and `DIRECT_URL` there, or always use `npm run db:*`.

---

## Neon database setup

1. Create a project at [https://neon.tech](https://neon.tech).  
2. Create a database branch (e.g. `production`).  
3. **Connect** → copy **pooled** connection string → `DATABASE_URL`.  
4. Copy **direct** connection string → `DIRECT_URL`.  
5. Ensure the URL includes SSL (`sslmode=require` is typical).  
6. Run `npm run db:migrate` locally (or `db:migrate:deploy` in deployment) so tables exist.

---

## Testing locally before deployment

Run these in order:

```bash
npm install
npm run db:validate
npm run lint
npm run build
npm run dev
```

Manual checks in the browser:

1. **Sign up** with name, email, password (≥ 8 characters).  
2. **Log in** → should land on **Dashboard**.  
3. Open **Start**, select one or more items, **Submit** → success message.  
4. Open **History** → rows appear, newest first.  
5. **Logout** → back to login; protected routes redirect to login when logged out.  
6. Wrong password on login → inline error, no session.

---

## GitHub

1. Create a new repository on GitHub (empty, no README if you already have one locally).  
2. From your project folder:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: task submission app"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```

3. Confirm `.env` and `.env.local` are **not** tracked (`git status`). `.env.example` should be committed.

---

## Vercel deployment

1. Push the repo to GitHub.  
2. Import the project in [Vercel](https://vercel.com) (Framework Preset: **Next.js**).  
3. **Environment variables** (Production / Preview as needed):

   - `DATABASE_URL`  
   - `DIRECT_URL`  
   - `AUTH_SECRET`  
   - `AUTH_URL` → your deployment URL, e.g. `https://<project>.vercel.app` (use your custom domain in production if applicable)

4. **Build command**: default `npm run build` (runs `prisma generate` then `next build`).  
5. **Apply migrations** to the production database **once** (from a trusted machine or CI):

   ```bash
   # With production DATABASE_URL + DIRECT_URL in .env or env:
   npm run db:migrate:deploy
   ```

   Or configure a Vercel **Deploy Hook** / GitHub Action that runs `prisma migrate deploy` against Neon after deploy.

6. Redeploy after changing env vars.

---

## Project structure (high level)

- `src/app/` — App Router pages (`/`, `/login`, `/signup`, `/dashboard`, `/tasks` (labeled **Start** in the UI), `/history`)  
- `src/proxy.ts` — Auth redirects for protected routes (Next.js 16 **proxy** convention)  
- `src/auth.ts` / `src/auth.config.ts` — NextAuth configuration  
- `src/actions/` — Server actions (auth + app)  
- `prisma/schema.prisma` — User, NextAuth models, `TaskSubmission` (one row per submit; `taskNames` is a string array)  

## Scripts reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## License

Private / your choice—add a `LICENSE` file if you open-source the repo.
