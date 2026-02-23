# Multi-Tenant Contact Manager

A React + Vite frontend with an Express backend for managing contacts across multiple tenants (companies).

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or pnpm

## Setup

### 1. Database

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -c "CREATE DATABASE contactapp;"
psql -U postgres -d contactapp -f backend/scripts/init-db.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials (required: DB_PASSWORD)
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend

In a new terminal:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Configuration

- **Backend**: Copy `backend/.env.example` to `backend/.env` and set `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`.
- **Frontend**: Set `VITE_API_URL` (e.g. `http://localhost:5000/api`) if the API is not at `http://localhost:5000/api`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `cd backend && npm run dev` | Start backend with nodemon |
| `cd backend && npm start` | Start backend |
