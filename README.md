# College Research Portal

A MERN application for students to submit research proposals to a faculty guide and for teachers to review submissions, update their status, and leave feedback.

## Features

- Student and teacher registration and login
- JWT based authentication with role protected research routes
- Student submission of a research title, description, document URL, and selected guide
- Student view of their own research submissions
- Teacher view of submissions assigned to them
- Teacher updates to submission status and feedback

## Tech stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, Mongoose, MongoDB
- Authentication: JSON Web Tokens and bcryptjs

## Project layout

```text
college-research-system/
├── college-research-backend/   # Express API and MongoDB models
├── college-research-frontend/  # React application
└── README.md
```

## Requirements

- Node.js and npm
- A running MongoDB instance (local or hosted)

## Setup

### 1. Configure the backend

Create `college-research-backend/.env` (this file is ignored by Git) with:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/research
JWT_SECRET=replace-this-with-a-long-random-secret
```

Use your own MongoDB connection string and a strong, private JWT secret. Never commit `.env` or real credentials.

Install dependencies and start the API:

```bash
cd college-research-backend
npm install
npm run dev
```

The API listens on port `3000` by default. Set `PORT` in `.env` to use a different port.

### 2. Start the frontend

In another terminal:

```bash
cd college-research-frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. The frontend currently sends API requests to `http://localhost:3000/api` (configured in `src/api/axios.js`).

## API overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a student or teacher |
| `POST` | `/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/auth/teachers` | Public | List available teachers |
| `POST` | `/research/submit` | Student | Submit research with `title`, `description`, `documentUrl`, and `guideId` |
| `GET` | `/research/my` | Student | List the signed-in student's submissions |
| `GET` | `/research/mystudent` | Teacher | List submissions assigned to the signed-in teacher |
| `PUT` | `/research/update/:id` | Teacher | Update a submission's `status` and/or `feedback` |

Protected endpoints expect the login token in the request header:

```text
Authorization: Bearer <token>
```

## Available scripts

Backend (`college-research-backend`):

- `npm run dev` — start the API with nodemon
- `npm start` — start the API with Node.js

Frontend (`college-research-frontend`):

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build in `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
