# FinTrack API Documentation

This document describes all available REST endpoints of the FinTrack Backend Server.
The API is built securely with Role-Based Access Control and JWT Cookie-based sessions.

## Base URL
`/api`

## Authentication Flow

This API relies on a dual-token approach:
1. **Access Token** (Sent in `Authorization: Bearer <token>` header). Lives 15 minutes.
2. **Refresh Token** (Stored purely as `httpOnly` secure cookies by backend). Used to regenerate access tokens when they expire on `/api/auth/refresh`.

---

## 1. Auth & Session Management (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Rate Limiting |
|--------|----------|-------------|---------------|---------------|
| `POST` | `/register` | Create a new user | Public | 10 reqs/15m |
| `POST` | `/login` | Authenticate an existing user | Public | 10 reqs/15m |
| `POST` | `/refresh` | Rotate refresh token and get a new access token | Cookie (httpOnly) | 10 reqs/15m |
| `POST` | `/logout` | Invalidate active refresh tokens | Bearer Token | Standard |
| `GET` | `/me` | Get the profile of the current logged-in user | Bearer Token | Standard |

---

## 2. Financial Records CRUD (`/api/records`)

This module manages all transactions. Search logic is provided.

| Method | Endpoint | Description | Auth Required | Role Level Required |
|--------|----------|-------------|---------------|-----------------------|
| `GET` | `/` | List all records (supports query parameters) | Bearer Token | `ALL` |
| `GET` | `/:id` | Get details of a single record | Bearer Token | `ALL` |
| `POST` | `/` | Create a new financial record | Bearer Token | `ADMIN` ONLY |
| `PATCH` | `/:id` | Update an existing financial record | Bearer Token | `ADMIN` ONLY |
| `DELETE` | `/:id` | Soft delete a financial record | Bearer Token | `ADMIN` ONLY |

### Supported Query Parameters for `GET /api/records/`
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Full-text search across descriptions and categories |
| `type` | "INCOME" \| "EXPENSE" | Filter by record type (uppercase) |
| `category` | string | Exact match filter by category |
| `startDate` | ISO Date string | Filter records from this date |
| `endDate` | ISO Date string | Filter records until this date |
| `range` | "7d" \| "30d" \| "90d" \| "ytd" | Quick date range filter |
| `page` | number | Page number for pagination |
| `limit` | number | Items per page (max 100) |
| `sort` | "date" \| "amount" \| "createdAt" | Sort field |
| `order` | "asc" \| "desc" | Sort order |

---

## 3. Dashboard Analytics (`/api/dashboard`)

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required | Role Level Required |
|--------|----------|-------------|---------------|-----------------------|
| `GET` | `/summary` | Aggregated stats: Total Income, Total Expense, Net Balance | Bearer Token | `VIEWER`, `ANALYST`, `ADMIN` |
| `GET` | `/category-breakdown` | Pie-chart data for total sums per category | Bearer Token | `VIEWER`, `ANALYST`, `ADMIN` |
| `GET` | `/trends` | Line-chart data showing metrics over time | Bearer Token | `VIEWER`, `ANALYST`, `ADMIN` |
| `GET` | `/recent` | Top 10 most recent transactions | Bearer Token | `ALL` |

### Dashboard Analytics Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `range` | "7d" \| "30d" \| "90d" \| "ytd" | Filter data by time range |

**Range Values:**
- `7d` - Last 7 days
- `30d` - Last 30 days
- `90d` - Last 90 days
- `ytd` - Year to date

---

## 4. Dashboard Configuration (`/api/dashboard`)

Manage dashboard layouts and widget settings.

| Method | Endpoint | Description | Auth Required | Role Level Required |
|--------|----------|-------------|---------------|-----------------------|
| `GET` | `/config` | Get current user's dashboard layout | Bearer Token | `ALL` |
| `GET` | `/config/list` | List all saved dashboard designs | Bearer Token | `ALL` |
| `POST` | `/config` | Create or update dashboard layout | Bearer Token | `ANALYST`, `ADMIN` |
| `DELETE` | `/config/:id` | Delete a dashboard design | Bearer Token | `ANALYST`, `ADMIN` |

### GET /config Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Specific dashboard config ID (optional, returns most recent if omitted) |

### POST /config Body
```json
{
  "name": "My Dashboard",
  "layout": [
    { "i": "summary-income", "x": 0, "y": 0, "w": 3, "h": 2 }
  ],
  "charts": [
    { "id": "trends", "type": "AREA", "title": "Financial Trends", "showLegend": true }
  ]
}
```
- `id` (optional): Include to update existing dashboard, omit to create new

---

## 5. User Management (`/api/users`)

| Method | Endpoint | Description | Auth Required | Role Level Required |
|--------|----------|-------------|---------------|-----------------------|
| `GET` | `/` | List all system users | Bearer Token | `ADMIN` ONLY |
| `GET` | `/:id` | Get detailed user information | Bearer Token | `ADMIN` ONLY |
| `PATCH` | `/:id` | Update user role or status | Bearer Token | `ADMIN` ONLY |
| `DELETE` | `/:id` | Deactivate user | Bearer Token | `ADMIN` ONLY |

---

## Standard Response Formats

**Success Response**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "fieldName", "message": "Validation error" }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 422 | Unprocessable Entity (validation failed) |
| 500 | Internal Server Error |

---

## Role Permissions Summary

| Feature | VIEWER | ANALYST | ADMIN |
|---------|--------|---------|-------|
| View recent activity | ✅ | ✅ | ✅ |
| View analytics (summary, trends, categories) | ✅ | ✅ | ✅ |
| View records list | ✅ | ✅ | ✅ |
| Create/Edit/Delete records | ❌ | ❌ | ✅ |
| Manage dashboard layouts | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
