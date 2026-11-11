# StaffSync

A full-stack staff management app for handling employees, attendance, leave requests, training and company announcements, with role-based access for HR, managers and employees.

**Live demo:** https://staffsync-phi.vercel.app

## Features

- **Role-based access** – three roles (`hr`, `manager`, `employee`) with different views and permissions
- **Employee directory** – add and manage employee records (HR and managers)
- **Attendance** – track staff attendance
- **Leave management** – submit and review leave requests
- **Training** – manage training records
- **Announcements** – share company updates
- **Dashboard** – summary stats for HR and managers; a simpler home view for employees
- **Profile page** – personal details for managers and employees
- **Authentication** – JWT-based login with hashed passwords

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend  | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth     | JSON Web Tokens, bcryptjs |
| Hosting  | Vercel (frontend) |

## Project Structure

```
staffsync/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/       # Dashboard, Employees, Attendance, Leaves, Training, ...
│       ├── components/  # Layout, Modal
│       └── context/     # AuthContext
└── server/          # Express API
    ├── models/      # User, Employee, Attendance, Leave, Training, Announcement
    ├── routes/      # auth, employees, leaves, attendance, training, announcements, stats, me
    └── middleware/  # JWT auth + role checks
```

## API Overview

All routes are prefixed with `/api`.

| Route            | Purpose |
|------------------|---------|
| `/auth`          | Register and log in |
| `/employees`     | Employee records |
| `/attendance`    | Attendance tracking |
| `/leaves`        | Leave requests |
| `/training`      | Training records |
| `/announcements` | Company announcements |
| `/stats`         | Dashboard statistics |
| `/me`            | Current user's own data |

Protected routes expect an `Authorization: Bearer <token>` header.

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone

```bash
git clone https://github.com/nandaniii79-droid/staffsync.git
cd staffsync
```

### 2. Run the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Then start it:

```bash
npm run dev
```

### 3. Run the client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start it:

```bash
npm run dev
```

The app runs at http://localhost:5173.

## Environment Variables

| Variable        | Where  | Description |
|-----------------|--------|-------------|
| `MONGO_URI`     | server | MongoDB connection string |
| `JWT_SECRET`    | server | Secret used to sign tokens |
| `PORT`          | server | API port (default `5000`) |
| `CLIENT_URL`    | server | Allowed CORS origin(s), comma-separated |
| `VITE_API_URL`  | client | Base URL of the API |

## Author

Nandani Rijhwani – [GitHub](https://github.com/nandaniii79-droid)
