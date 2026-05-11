# We Want The Truth

Deploy-ready Next.js 14 multi-tenant app (frontend + tenant admin + super admin) with Prisma and PostgreSQL.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind
- Prisma ORM + PostgreSQL
- NextAuth credential authentication
- Optional Stripe billing + AWS S3 uploads

## Run locally (fast path)

```bash
npm install
cp .env.example .env
docker compose up -d db
npm run db:push
npm run db:seed
npm run dev
```

App URLs:
- Main frontend: `http://localhost:3001`
- Tenant public: `http://localhost:3001/t/beanvspenn`
- Tenant admin: `http://localhost:3001/t/beanvspenn/admin`
- Super admin: `http://localhost:3001/super-admin`

## Environment variables

Copy `.env.example` to `.env` and set real values for production.

Required:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

Domain-routing:
- `MARKETING_HOSTS`
- `SUPER_ADMIN_HOSTS`
- `TENANT_HOST_MAP` (JSON map: host -> tenant slug)

Optional:
- Stripe: `STRIPE_*`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- S3 uploads: `AWS_*`, `S3_BUCKET`

## Database

Local PostgreSQL comes from `docker-compose.yml`.

```bash
docker compose up -d db
npm run db:push
npm run db:seed
```

Useful Prisma commands:
- `npm run db:push`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:studio`

## Docker

This project has one app container that serves all three surfaces:
- Frontend
- Tenant admin
- Super admin

Build image:

```bash
docker build -t we-want-the-truth .
```

Run with compose (app + db):

```bash
docker compose up -d --build
```

Run only production app compose:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Railway deploy

`railway.json` is included with healthcheck path `/api/health`.

Steps:
1. Push project to GitHub.
2. Create Railway project and connect repository.
3. Add PostgreSQL service (or external Postgres) and configure `DATABASE_URL`.
4. Add env values from `.env.example`.
5. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Railway app URL.
6. Deploy.
7. Run one-time seed if needed: `npm run db:seed`.

## Health check

- `GET /api/health` returns app and database status.

## Seed credentials (change immediately in production)

- Super admin: `superadmin@we-want-the-truth.com` / `DevPassword!ChangeMe`
- Tenant admin: `admin@beanvspenn.com` / `DevPassword!ChangeMe`
- Tenant admin: `admin@cirightvscentili.com` / `DevPassword!ChangeMe`
