# Artifact Guide Backend

Express API for the multilingual artifact guide.

## Local setup

From the repository root:

```bash
cd backend
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to the PostgreSQL connection string from Supabase.
For a long-running Express server, use the Supabase session pooler or direct
connection details appropriate for your network. Ensure the URL requires TLS
(`sslmode=require`). Never commit `.env`.

Run `src/db/schema.sql` in the Supabase SQL Editor to create the tables, then
start the API:

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default. Vite's
`http://localhost:5173` and `http://127.0.0.1:5173` origins are allowed for
local development.

## Deploy to Render

Create a **Web Service** from the repository and configure:

- **Root Directory:** `backend`
- **Build Command:** `npm ci --include=dev && npm run build`
- **Start Command:** `npm start`

Add these environment variables in the Render service settings:

- `DATABASE_URL`: Supabase PostgreSQL connection string with TLS enabled.
- `CORS_ORIGINS`: comma-separated exact web origins, for example
  `https://your-project.vercel.app`.
- `NODE_ENV`: `production` (Render provides `PORT` for the service).

## Deploy to Railway

Create a Railway service from the repository and set its **Root Directory** to
`/backend`. Configure:

- **Build Command:** `npm ci --include=dev && npm run build`
- **Start Command:** `npm start`

Set `DATABASE_URL`, `CORS_ORIGINS`, and `NODE_ENV=production` in the service
variables. Railway provides `PORT` automatically. If using a Supabase pooler,
use its session mode for this long-running Express process.

`CORS_ORIGINS` accepts comma-separated exact origins without path segments or
trailing slashes. Local HTTP origins on `localhost`, `127.0.0.1`, and `::1` are
also allowed.

## API

- `GET /api/health`
- `GET /api/languages`
- `GET /api/artifacts?lang=vi&q=tank`
- `GET /api/artifacts/:slug?lang=vi`
