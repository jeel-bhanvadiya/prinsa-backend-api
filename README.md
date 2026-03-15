# Prinsa Demo – Node.js + MongoDB Backend

REST API for Super Admin (signup/login) and Employee CRUD + salary list. Ready for free-tier deployment (Render, Railway, etc.) with MongoDB Atlas.

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster)

## Quick start

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

Server runs at `http://localhost:5000` (or your `PORT`).

---

## API Reference

Base URL: `http://localhost:5000` (or your deployed URL)

### 1. Super Admin Signup

**POST** `/api/auth/signup`

Creates a new super admin. Email must be unique.

**Body (JSON):**

| Field    | Type     | Required | Description              |
|----------|----------|----------|--------------------------|
| name     | string   | Yes      | Full name                |
| email    | string   | Yes      | Unique email             |
| password | string   | Yes      | Min 6 characters         |
| age      | number   | Yes      | Age                      |
| gender   | string   | Yes      | `male` \| `female` \| `other` |
| hobby    | string[] | No       | Array of hobbies         |

**Example:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "secret123",
  "age": 30,
  "gender": "male",
  "hobby": ["reading", "coding"]
}
```

**Response:** `201` – `{ success, message, data: { id, name, email, age, gender, hobby, token } }`

---

### 2. Super Admin Login

**POST** `/api/auth/login`

**Body (JSON):**

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | Yes      |
| password | string | Yes      |

**Response:** `200` – `{ success, message, data: { id, name, email, age, gender, hobby, token } }`

Use `data.token` in the **Authorization** header for protected routes:

```
Authorization: Bearer <token>
```

---

### 3. Employee APIs (all require Super Admin token)

**Authorization:** `Authorization: Bearer <token>`

#### Create employee

**POST** `/api/employees`

**Body (JSON):**

| Field        | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| name        | string | Yes      | Full name          |
| email       | string | Yes      | Unique email       |
| password    | string | Yes      | Min 6 characters   |
| age         | number | Yes      | Age                |
| gender      | string | Yes      | `male` \| `female` \| `other` |
| salary      | number | Yes      | Salary (≥ 0)       |
| joiningDate | string | Yes      | ISO date (e.g. `2024-01-15`) |

**Example:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass123",
  "age": 28,
  "gender": "male",
  "salary": 50000,
  "joiningDate": "2024-01-15"
}
```

**Response:** `201` – `{ success, message, data: employee }`

---

#### List employees

**GET** `/api/employees`

**Response:** `200` – `{ success, data: [...], count }`

---

#### Update employee

**PUT** `/api/employees/:id`

**Body (JSON):** any of `name`, `email`, `password`, `age`, `gender`, `salary`, `joiningDate` (all optional; only send fields to update).

**Response:** `200` – `{ success, message, data: employee }`

---

#### Delete employee

**DELETE** `/api/employees/:id`

**Response:** `200` – `{ success, message }`

---

### 4. Salary list

**GET** `/api/employees/salary-list`

Returns employees with salary-related fields and total salary.

**Response:** `200` – `{ success, data: [...], count, totalSalary }`

---

## Environment variables

| Variable     | Description                    | Example / note                          |
|-------------|--------------------------------|-----------------------------------------|
| `PORT`      | Server port                    | `5000` (default)                        |
| `MONGODB_URI` | MongoDB connection string   | `mongodb+srv://user:pass@cluster.mongodb.net/prinsa` |
| `JWT_SECRET`  | Secret for JWT signing      | Long random string in production        |
| `NODE_ENV`    | Environment                  | `production` on deploy                  |

---

## Deploy on a free server

### MongoDB (free)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 cluster.
3. Database Access → Add user (username + password).
4. Network Access → Add IP `0.0.0.0` (or your host’s IP).
5. Connect → “Drivers” → copy connection string. Replace `<password>` with your DB user password.
6. Use this as `MONGODB_URI` (e.g. add database name: `...mongodb.net/prinsa`).

### Render (free)

1. Push code to GitHub.
2. [Render](https://render.com) → New → Web Service → connect repo.
3. Root directory: `backend` (if backend is in a subfolder).
4. Build: `npm install`, Start: `npm start`.
5. Environment: add `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT` (Render sets it).
6. Deploy. Your API URL will be like `https://your-app.onrender.com`.

### Railway (free tier)

1. [Railway](https://railway.app) → New Project → Deploy from GitHub.
2. Select repo and set root to `backend` if needed.
3. Variables: add `MONGODB_URI`, `JWT_SECRET`.
4. Deploy. Railway assigns a public URL.

### Cyclic / other Node hosts

- Set **start command** to `npm start`.
- Set **root** to the folder that contains `package.json` (e.g. `backend`).
- Add `MONGODB_URI` and `JWT_SECRET` in the dashboard.

---

## Scripts

- `npm start` – run server (production).
- `npm run dev` – run with `--watch` for development.

---

## Health check

**GET** `/health`  
Response: `{ ok: true, message: "API is running" }` – useful for uptime checks on free hosts.
