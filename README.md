# Multi-User Lead Management Portal

A production-oriented full-stack lead management portal with secure authentication, per-user lead isolation, CRUD workflows, search/filtering, pagination, CSV export, dark mode, and Swagger API documentation.

## Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Security: bcrypt password hashing, JWT auth in HTTP-only cookies, Helmet, CORS allowlist, rate limiting
- Validation: Zod on backend, client-side form validation in React
- API Docs: Swagger UI at `/api/docs`

## Project Structure

```text
client/                 React app
  src/api/              Axios API client
  src/components/       Reusable UI and lead form/table components
  src/context/          Authentication state
  src/pages/            Route pages
server/                 Express API
  src/config/           Environment and database setup
  src/controllers/      Request handlers
  src/docs/             Swagger OpenAPI definition
  src/middleware/       Auth, validation, and error middleware
  src/models/           Mongoose schemas
  src/routes/           REST routes
  src/services/         Auth and lead domain logic
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create server environment file:

```bash
cp server/.env.example server/.env
```

3. Update `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/lead_management_portal
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

4. Optional client environment file:

```bash
cp client/.env.example client/.env
```

5. Start MongoDB locally, then run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`  
Swagger docs: `http://localhost:5000/api/docs`

## Authentication

Registration and login return the authenticated user and set a signed JWT in an HTTP-only cookie named `access_token`. The React client never reads the token directly; API requests use `withCredentials: true`.

Protected routes require a valid cookie. For API clients, the backend also accepts `Authorization: Bearer <token>`.

## Database Schema

### User

| Field | Type | Notes |
| --- | --- | --- |
| name | String | Required, trimmed |
| email | String | Required, unique, lowercase |
| password | String | Required bcrypt hash |
| createdAt / updatedAt | Date | Mongoose timestamps |

### Lead

| Field | Type | Notes |
| --- | --- | --- |
| userId | ObjectId | Required, indexed, references `User` |
| leadName | String | Required |
| companyName | String | Required |
| email | String | Required |
| phoneNumber | String | Required |
| serviceInterested | String | Required |
| status | Enum | `New`, `Contacted`, `Qualified`, `Proposal`, `Won`, `Lost` |
| notes | String | Optional |
| createdAt / updatedAt | Date | Mongoose timestamps |

Every lead query includes `userId: req.user.id`, so users can only access their own leads.

## REST API Summary

Base URL: `/api`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and set auth cookie |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/auth/logout` | Yes | Clear auth cookie |
| GET | `/leads` | Yes | List leads with `q`, `status`, `page`, `limit` |
| POST | `/leads` | Yes | Create a lead |
| GET | `/leads/:id` | Yes | Get one owned lead |
| PATCH | `/leads/:id` | Yes | Update one owned lead |
| DELETE | `/leads/:id` | Yes | Delete one owned lead |

## Production Notes

- Set `NODE_ENV=production`.
- Use a strong `JWT_SECRET` from a secrets manager.
- Serve behind HTTPS so secure cookies are enabled.
- Configure `CLIENT_ORIGIN` to the deployed frontend origin.
- Use MongoDB Atlas or another managed MongoDB instance with backups enabled.
- Run `npm run build` to generate the frontend production bundle.
