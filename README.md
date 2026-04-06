# FinTrack — Finance Dashboard

A full-stack finance dashboard with role-based access control, built as a monorepo with a **React** frontend and **Express** backend.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Assessment Requirements Coverage](#assessment-requirements-coverage)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Access Control](#access-control)
- [Project Structure](#project-structure)
- [Assumptions & Tradeoffs](#assumptions--tradeoffs)

---

## Overview

FinTrack is a finance dashboard system where users interact with financial records based on their role. The system supports **storage and management of financial entries**, **user roles and permissions**, and **summary-level analytics**.

### Demo Credentials

| Role    | Email                | Password   |
|---------|----------------------|------------|
| Admin   | admin@fintrack.com   | Admin@123  |
| Analyst | analyst@fintrack.com  | Analyst@123 |
| Viewer  | viewer@fintrack.com  | Viewer@123 |

---

## Assessment Requirements Coverage

This project fulfills all core requirements and includes optional enhancements from the assessment:

### Core Requirements ✅

| Requirement | Implementation |
|------------|----------------|
| **1. User and Role Management** | 3 roles (VIEWER, ANALYST, ADMIN), user CRUD, status management (ACTIVE/INACTIVE), role-based access control via middleware |
| **2. Financial Records Management** | Full CRUD with fields: amount, type (INCOME/EXPENSE), category, date, description. Filtering by date, category, type. |
| **3. Dashboard Summary APIs** | `/summary` (totals), `/category-breakdown` (by category), `/trends` (monthly), `/recent` (latest 10) |
| **4. Access Control Logic** | RBAC middleware (`requireRole`) enforcing Viewer < Analyst < Admin permissions |
| **5. Validation and Error Handling** | Zod schemas for all inputs, proper HTTP status codes (400, 401, 403, 404, 422, 500) |
| **6. Data Persistence** | PostgreSQL via Neon, managed with Prisma ORM |

### Optional Enhancements ✅

| Enhancement | Implementation |
|------------|----------------|
| Authentication (tokens/sessions) | JWT with access token (memory) + refresh token (httpOnly cookie), auto-refresh on 401 |
| Pagination | Server-side pagination on records and users listing |
| Search | Full-text search across descriptions and categories |
| Soft delete | Records use `isDeleted` flag, never permanently deleted |
| Rate limiting | `express-rate-limit` on auth endpoints (10 req/15m) |
| API documentation | `server/api-docs.md` with full endpoint reference |

---

## Architecture

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  React Frontend  │────▶│   Express Backend    │────▶│  Neon Postgres│
│  (Vite + TS)     │     │   (TypeScript + Zod) │     │  (Prisma ORM) │
│  TanStack Query  │◀────│   JWT Auth + RBAC    │◀────│              │
│  Tailwind CSS    │     │   cookie + bearer    │     │              │
└──────────────────┘     └──────────────────────┘     └──────────────┘
```

### Authentication Flow

1. **Login** → Server returns `accessToken` (in response body) + `refreshToken` (in httpOnly cookie)
2. **Requests** → Client sends `accessToken` in `Authorization: Bearer` header (stored in memory)
3. **Token Expiry** → On 401, Axios interceptor auto-calls `/api/auth/refresh` using the cookie
4. **Refresh** → Server rotates the refresh token (deletes old, creates new) and returns a new access token
5. **Logout** → Server invalidates refresh token, client clears memory

---

## Tech Stack

### Backend (`/server`)
| Component     | Technology                |
|---------------|---------------------------|
| Runtime       | Node.js + TypeScript      |
| Framework     | Express 4                 |
| ORM           | Prisma                    |
| Validation    | Zod                       |
| Auth          | JWT (jsonwebtoken + bcryptjs) |
| Database      | PostgreSQL (Neon)         |

### Frontend (`/client`)
| Component     | Technology                |
|---------------|---------------------------|
| Framework     | React 18 + TypeScript     |
| Build Tool    | Vite                      |
| Styling       | Tailwind CSS 3            |
| State/Fetch   | TanStack Query v5         |
| Routing       | React Router v6           |
| Charts        | Recharts                  |
| Icons         | Lucide React              |
| HTTP Client   | Axios                     |

---

## Features

### Core
- ✅ **Modular Dashboard** — Fully customizable widget-based layout (drag, resize, add, remove)
- ✅ **Multiple Designs** — Create, name, save, and switch between different dashboard layouts
- ✅ **Dynamic Widgets** — Individual Summary Cards, Financial Trends (Area/Bar/Line), Expense Breakdown (Pie), and Recent Activity
- ✅ **Time Range Filtering** — Filter dashboard data by 7 days, 30 days, 90 days, or year-to-date
- ✅ **URL State Synchronization** — All filters, search, and dashboard time ranges are synced with URL search parameters
- ✅ **Team & Role Management** — Detailed user management with roles (Viewer/Analyst/Admin) and status control
- ✅ **Financial Records CRUD** — Professional ledger with category-based tracking and soft-delete capabilities
- ✅ **Access Control (RBAC)** — Secure middleware-based role enforcement across the full stack

### Auth
- ✅ **Refresh Token Rotation** — Enhanced security with automatic token rotation and httpOnly cookies
- ✅ **Seamless Auto-Refresh** — Transparent token refresh via Axios interceptors for a non-blocking user experience

### Frontend UI/UX
- ✅ **Premium Aesthetics** — Modern glassmorphism with ambient lighting effects
- ✅ **Dark / Light Mode** — Intelligent theme switching with system preference detection
- ✅ **Responsive Design** — Grid-based responsive layouts optimized for all screen sizes
- ✅ **Rich Data Seeding** — Pre-populated with realistic financial data
- ✅ **Interactive Modals** — Sleek modals for widget configuration and design management

### Extras
- ✅ **Soft Delete** — Financial records are soft-deleted (not permanently removed)
- ✅ **Pagination** — Server-side pagination for records and users
- ✅ **Search** — Full-text search across descriptions and categories
- ✅ **Seed Data** — Pre-populated with 3 users and 200 financial records
- ✅ **Dockerized** — Both client and server with Docker Compose

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database (or use the provided Neon connection)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=/api
VITE_BACKEND_API_URL=http://localhost:5000
```

### 3. Setup Database

```bash
cd server

# Push schema to database
npx prisma db push

# Seed with sample data
npm run prisma:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your DATABASE_URL

# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

Access:
- **Frontend**: http://localhost (port 80)
- **Backend**: http://localhost:5000

### Individual Docker Containers

**Server Only:**
```bash
cd server
docker build -t fintrack-server .
docker run -p 5000:5000 --env-file .env fintrack-server
```

**Client Only:**
```bash
cd client
docker build -t fintrack-client .
docker run -p 80:80 fintrack-client
```

### Environment Variables for Docker

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost
```

### Docker Architecture
- **Client** → Multi-stage build: Vite build → nginx serving static files + reverse proxy to API
- **Server** → Multi-stage build: TypeScript compile → Node.js production runtime

---

## API Documentation

Detailed API documentation is available in [server/api-docs.md](./server/api-docs.md)

### Quick Reference

| Module | Endpoints |
|--------|-----------|
| Auth | POST `/api/auth/login`, `/register`, `/refresh`, `/logout` |
| Records | GET/POST/PATCH/DELETE `/api/records` |
| Dashboard | GET `/api/dashboard/summary`, `/category-breakdown`, `/trends`, `/recent` |
| Dashboard Config | GET/POST/DELETE `/api/dashboard/config` |
| Users | GET/PATCH/DELETE `/api/users` |

---

## Access Control

| Action                    | Viewer | Analyst | Admin |
|---------------------------|--------|---------|-------|
| View recent activity       | ✅      | ✅       | ✅     |
| View dashboard analytics   | ✅      | ✅       | ✅     |
| View records list          | ✅      | ✅       | ✅     |
| Create/Edit/Delete records | ❌     | ❌       | ✅     |
| Customize dashboards       | ❌     | ✅       | ✅     |
| Manage users              | ❌     | ❌       | ✅     |

---

## Project Structure

```
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/               # Axios API client + modules
│   │   ├── components/        # UI components
│   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   ├── layout/        # Sidebar, Header, AppLayout
│   │   │   ├── records/       # Record management
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── users/         # User management
│   │   ├── contexts/          # AuthContext, ThemeContext
│   │   ├── hooks/             # Custom hooks (useDashboard, useDebounce)
│   │   ├── pages/             # Login, Register, Dashboard, Records, Users
│   │   └── types/             # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── lib/               # Prisma client singleton
│   │   ├── middleware/        # Auth, RBAC, validation, errors
│   │   ├── routes/            # Express routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # JWT, response helpers
│   │   └── validators/        # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env                        # Environment variables (gitignored)
├── README.md
└── server/api-docs.md          # Detailed API documentation
```

---

## Assumptions & Tradeoffs

1. **Role model**: Three roles (Viewer/Analyst/Admin) are implemented. A production system might use a permissions table for more granular control.

2. **No email verification**: Registration immediately creates an active account. In production, email verification would be added.

3. **Soft delete only**: Financial records use soft delete (`isDeleted` flag). Hard delete is not exposed.

4. **In-DB refresh tokens**: Refresh tokens are stored in the database. For higher scale, Redis would be preferred.

5. **No rate limiting on all endpoints**: Rate limiting is applied only to auth endpoints. Full rate limiting would be added in production.

6. **Single-user record ownership**: Records are tied to the user who created them, but all authenticated users can view all records (based on role permissions).

7. **Mock currency**: All amounts are in USD. Multi-currency support is not implemented.

8. **Neon PostgreSQL**: Uses a serverless PostgreSQL provider with connection pooling.

---

## Assessment Checklist

| Category | Requirement | Status |
|----------|-------------|--------|
| **Core** | User & Role Management | ✅ |
| | Financial Records CRUD | ✅ |
| | Dashboard Summary APIs | ✅ |
| | Access Control Logic | ✅ |
| | Validation & Error Handling | ✅ |
| | Data Persistence | ✅ |
| **Optional** | JWT Authentication | ✅ |
| | Pagination | ✅ |
| | Search | ✅ |
| | Soft Delete | ✅ |
| | Rate Limiting | ✅ |
| | API Documentation | ✅ |
| **Tech** | Node.js + Express + TypeScript | ✅ |
| | Zod Validation | ✅ |
| | Prisma ORM | ✅ |
| | React + Vite + TypeScript | ✅ |
| | Tailwind CSS | ✅ |
| | TanStack Query | ✅ |
| | Dark/Light Mode | ✅ |
| | Neon PostgreSQL | ✅ |
| | JWT Cookie Auth | ✅ |
| | Docker + Compose | ✅ |

---

**Built with ❤️**
