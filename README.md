# CSCVAN Van-Scheduling App

> 🚨 **Before you begin, **disable all browser extensions** (especially ad blockers, privacy tools, and any Google-related extensions). Extensions often block Google OAuth flows, preventing login.**

This README explains how to set up, configure, and run the full-stack CSCVAN van-scheduling application locally. It covers installing dependencies, configuring environment files, running a local MongoDB, and starting both backend and frontend.

> **Important**: We have pre-configured keys via `.env` files so the grader can run the app without needing to add secrets manually. **Do not** add or edit any other secret files.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Installing Dependencies](#installing-dependencies)
5. [Setting Up MongoDB Locally](#setting-up-mongodb-locally)
6. [Running the Backend (Express + MongoDB)](#running-the-backend-express--mongodb)
7. [Running the Frontend (React)](#running-the-frontend-react)
8. [Testing Admin Functionality](#testing-admin-functionality)
9. [Build & Deployment Checklist](#build--deployment-checklist)
10. [Common Troubleshooting](#common-troubleshooting)

---

## Project Structure

```
CS35L_Van-Scheduling/
│
├── client/                       ← React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx (or index.jsx)
│   ├── .env                       ← VITE_CLIENT_ID="539152497200-…sqs.apps.googleusercontent.com"
│   ├── package.json
│   ├── vite.config.js
│   └── README.md (optional)
│
├── server/                       ← Express + Mongoose backend
│   ├── middlewares/
│   │   ├── requireAuth.js
│   │   └── requireAdmin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Return.js
│   │   └── Van.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── bookings.js
│   │   ├── driverapp.js
│   │   └── returns.js
│   ├── .env                       ← MONGO_URI="mongodb://localhost:27017/35ldb"
│   │                              CLIENT_ID="539152497200-…sqs.apps.googleusercontent.com"
│   │                              ADMIN_EMAILS="transportation@uclacsc.org,wanjun01@g.ucla.edu,celinee@g.ucla.edu,zhaochen@g.ucla.edu"
│   ├── server.js
│   └── package.json
│
└── README.md                     ← (This file)
```

---

## Prerequisites

1. **Node.js & npm** (v16+ recommended)
   Verify:

   ```bash
   node -v
   npm -v
   ```
2. **Git**
3. **MongoDB** (local)

---

## Environment Configuration

### 1. Frontend `.env` (client/.env)

Create a file named `.env` in the `client/` folder with exactly:

```
VITE_CLIENT_ID="539152497200-qgajpt09gnlgolmik3duohq8lrhv4sqs.apps.googleusercontent.com"
```

> **Do not** prefix with anything other than `VITE_`.
> **Do not** store additional secrets here.

### 2. Backend `.env` (server/.env)

Create or update `server/.env` with:

```
MONGO_URI="mongodb://localhost:27017/35ldb"
CLIENT_ID="539152497200-qgajpt09gnlgolmik3duohq8lrhv4sqs.apps.googleusercontent.com"
ADMIN_EMAILS="transportation@uclacsc.org,wanjun01@g.ucla.edu,celinee@g.ucla.edu,zhaochen@g.ucla.edu"
```

* **MONGO\_URI** points to your local MongoDB instance.
* **CLIENT\_ID** matches the Google OAuth Client ID.
* **ADMIN\_EMAILS** is a comma-separated list of allowed admin emails.

---

## Installing Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

---

## Setting Up MongoDB Locally

1. **Install via Homebrew (macOS)**

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   brew services start mongodb-community@6.0
   ```
2. **Verify**

   ```bash
   mongosh
   use 35ldb
   db.stats()
   exit
   ```

---

## Running the Backend (Express + MongoDB)

1. Open a terminal and navigate to `server/`:

   ```bash
   cd server
   ```
2. Start the server:

   ```bash
   node server.js
   ```
3. You should see:

   ```
   ✅ Connected to MongoDB
   ✅ Vans are initialized (hard-coded).
   Server running at http://localhost:3000
   ```

---

## Running the Frontend (React)

> 🚨 **Reminder**: **Disable all browser extensions** (especially ad blockers or privacy plugins) before clicking “Sign in with Google.”

1. In a new terminal, navigate to `client/`:

   ```bash
   cd client
   ```
2. Start the Vite dev server:

   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`.
4. Click **Sign in with Google** and use any valid `@ucla.edu` or `@g.ucla.edu` account to log in. Without extensions disabled, OAuth may fail silently.

---

## Testing Admin Functionality

By default, the following admin emails are in `ADMIN_EMAILS`:

```
transportation@uclacsc.org
wanjun01@g.ucla.edu
celinee@g.ucla.edu
zhaochen@g.ucla.edu
```

If you (the grader) want to test admin-only routes using your own Google account, follow one of these methods:

### Option A: Add Your Email Before Launching (Recommended)

1. In `server/.env`, append your email to `ADMIN_EMAILS`:

   ```
   ADMIN_EMAILS="transportation@uclacsc.org,wanjun01@g.ucla.edu,celinee@g.ucla.edu,zhaochen@g.ucla.edu,grader123@g.ucla.edu"
   ```
2. Restart the server (so it picks up the updated `ADMIN_EMAILS`):

   ```bash
   cd server
   node server.js
   ```
3. In your browser, disabled extensions, go to `http://localhost:5173`, and sign in with `grader123@g.ucla.edu`.

   * The backend will create your user record with `role: "admin"`.
   * On the Dashboard, you’ll immediately see **Admin Tools**.

### Option B: If You’ve Already Signed In as a Regular User

If you logged in before editing `ADMIN_EMAILS`, your existing user record remains `role: "user”`. To fix:

1. Open Mongo shell:

   ```bash
   mongosh 35ldb
   ```
2. Delete your existing user:

   ```js
   db.users.deleteOne({ email: "grader123@g.ucla.edu" })
   exit
   ```
3. Restart the server:

   ```bash
   cd server
   node server.js
   ```
4. Sign in again at `http://localhost:5173` with `grader123@g.ucla.edu`.

   * Now the backend will create you with `role: "admin"`.

Once you have an admin session, you can:

* Visit `GET http://localhost:3000/api/admin/users`
* Visit `GET http://localhost:3000/api/admin/pending-users`
* `POST http://localhost:3000/api/admin/approve-user` with `{ "uid": ... }`
* `POST http://localhost:3000/api/admin/reject-user` with `{ "uid": ... }`

---

## Build & Deployment Checklist

1. `git init` (if not already a repo)
2. **Commit** changes in logical chunks:

   * Server setup
   * Models/routes
   * React scaffold
   * DriverApp + Multer
   * README updates
3. **Push** to a private GitHub repo:

   ```bash
   git remote add origin https://github.com/your-username/csc-van-app.git
   git add .
   git commit -m "Initial setup: backend + frontend skeleton"
   git push -u origin main
   ```
4. Ensure `.env` files are **not** committed.

---

## Common Troubleshooting

1. **OAuth keeps failing / client ID undefined**

   * Make sure `client/.env` exists at project root, not under `src/`.
   * Use exactly `VITE_CLIENT_ID="..."`.
   * Restart Vite after editing `.env`.
   * **Disable all browser extensions** before testing.

2. **403 on admin routes**

   * Confirm your email is in the comma-separated `ADMIN_EMAILS` in `server/.env`.
   * If you signed in before adding yourself, delete your user from MongoDB, restart server, sign in again.

3. **“Unexpected token ‘<’” on file upload**

   * Ensure Multer’s `upload.fields(...)` is used in `driverapp.js` so Express doesn’t parse `multipart/form-data` as JSON.

4. **Session/CORS issues**

   * Backend must include:

     ```js
     app.use(cors({ origin: "http://localhost:5173", credentials: true }));
     app.use(cookieParser());
     app.use(session({
       secret: process.env.SESSION_SECRET || "replace-with-secure-secret",
       resave: false,
       saveUninitialized: false,
       cookie: { httpOnly: true, sameSite: "lax" }
     }));
     ```
   * Frontend fetch calls must use `credentials: "include"`.

5. **MongoDB connection errors**

   * Double-check `MONGO_URI` in `server/.env`.
   * Confirm MongoDB is running (`brew services start mongodb-community@6.0` or manually `mongod --dbpath /usr/local/var/mongodb`).

6. **MIME-type rejections**

   * File uploads only allow `image/jpeg`, `image/png`, `image/gif`, `application/pdf`.

7. **Browser extensions interfering with Google OAuth**

   * **DISABLE ALL EXTENSIONS** before clicking “Sign in with Google.”

---

By following these steps carefully—especially disabling extensions, editing your `.env` before first login, and using the correct environment variables—you’ll have a fully functional local instance of CSCVAN with both user and admin functionality testable. Good luck!
