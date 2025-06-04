# CSCVAN Van-Scheduling App

This README explains how to set up, configure, and run the full-stack CSCVAN van-scheduling application locally. It covers installing dependencies, configuring environment files (with a pre-set Google Client ID), running a local MongoDB, and starting both backend and frontend.

> **Important**: We have pre-configured the Google OAuth Client ID so that the grader can run the app without needing their own credentials. Do **not** change the Client ID in `server/secrets.js` or `client/src/secrets.js`. To test admin routes, follow the “Testing Admin Functionality” section below.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Pre-configured Secrets](#pre-configured-secrets)
4. [Environment Configuration](#environment-configuration)
5. [Installing Dependencies](#installing-dependencies)
6. [Setting Up MongoDB Locally](#setting-up-mongodb-locally)
7. [Running the Backend (Express + MongoDB)](#running-the-backend-express--mongodb)
8. [Running the Frontend (React)](#running-the-frontend-react)
9. [Testing Admin Functionality](#testing-admin-functionality)
10. [Building for Production](#building-for-production)
11. [File Uploads & GridFS](#file-uploads--gridfs)
12. [Common Troubleshooting](#common-troubleshooting)

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
│   │   ├── secrets.js            ← Exports { clientId: "539152497200-…sqs.apps.googleusercontent.com" }
│   │   ├── App.jsx
│   │   └── main.jsx (or index.jsx)
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
│   ├── .env.example              ← “MONGODB_URI=…” template
│   ├── .env                      ← You create this with: MONGODB_URI="mongodb://localhost:27017/35ldb"
│   ├── secrets.js                ← Exports { CLIENT_ID: "539152497200-…sqs.apps.googleusercontent.com" }
│   ├── server.js                 ← Main entry point
│   └── package.json
│
└── README.md                     ← (This file)
```

---

## Prerequisites

1. **Node.js & npm** (v16+ recommended)
2. **Git**
3. **MongoDB** (local)

---

## Pre-configured Secrets

To simplify grading, we have already provided the Google OAuth Client ID in these two files; **do not change them**:

### 1. `server/secrets.js`

```js
// server/secrets.js
module.exports = {
  CLIENT_ID: "539152497200-qgajpt09gnlgolmik3duohq8lrhv4sqs.apps.googleusercontent.com"
};
```

### 2. `client/src/secrets.js`

```js
// client/src/secrets.js
const secrets = {
  clientId: "539152497200-qgajpt09gnlgolmik3duohq8lrhv4sqs.apps.googleusercontent.com"
};
export default secrets;
```

---

## Environment Configuration

### 1. Backend: `server/.env`

Copy `server/.env.example` to `server/.env` and set:

```
MONGODB_URI="mongodb://localhost:27017/35ldb"
```

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

1. Navigate to `server/`:

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

1. Navigate to `client/`:

   ```bash
   cd client
   ```
2. Start the Vite dev server:

   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Click **Sign in with Google** and use any valid `@ucla.edu` or `@g.ucla.edu` account to log in.

---

## Testing Admin Functionality

By default, only the following emails are treated as admins:

```
transportation@uclacsc.org
wanjun01@g.ucla.edu
celinee@g.ucla.edu
```

If a grader wants to test admin-only routes using their own Google account, follow one of these methods:

### Option A: Add Your Email Before Launching (Recommended)

1. **Edit `server/routes/auth.js`:**

   ```diff
   // server/routes/auth.js
   const ADMIN_EMAILS = [
     "transportation@uclacsc.org",
     "wanjun01@g.ucla.edu",
     "celinee@g.ucla.edu",
   + "your_test_email@g.ucla.edu"
   ];
   ```
2. **Edit `server/middlewares/requireAdmin.js`:**

   ```diff
   // server/middlewares/requireAdmin.js
   const ADMIN_EMAILS = [
     "transportation@uclacsc.org",
     "wanjun01@g.ucla.edu",
     "celinee@g.ucla.edu",
   + "your_test_email@g.ucla.edu"
   ];
   ```
3. **Restart the server** (so the changes take effect):

   ```bash
   cd server
   node server.js
   ```
4. **Sign in** at `http://localhost:5173` with `your_test_email@g.ucla.edu`.

   * The first time you log in, the backend recognizes that your email is in `ADMIN_EMAILS` and creates your user document with `role: "admin"`.
   * On the Dashboard, you’ll see **Admin Tools** appear immediately.

### Option B: If You’ve Already Signed In as a Regular User

If you logged in before adding your email to `ADMIN_EMAILS`, your existing user document will have `role: "user"`. Even after updating the code, the server still sees you as a non-admin. To fix that:

1. **Delete your existing user record from MongoDB**:

   ```bash
   mongosh 35ldb
   db.users.deleteOne({ email: "your_test_email@g.ucla.edu" })
   exit
   ```
2. **Restart the server** (so it picks up the updated `ADMIN_EMAILS`):

   ```bash
   cd server
   node server.js
   ```
3. **Sign in again** at `http://localhost:5173` with `your_test_email@g.ucla.edu`.

   * Now the backend will create a fresh user document with `role: "admin"`.

---

## File Uploads & GridFS

* Multer’s `memoryStorage` buffers file uploads.
* We stream them into a `GridFSBucket` named `"driverFiles"`.
* The resulting `ObjectId` (e.g. `dmvFileId`) is stored in `user.driverApplication`.
* To download files, a route can call `bucket.openDownloadStream(ObjectId)` and pipe to the response.

---

## Common Troubleshooting

1. **“Unexpected token ‘<’” on multipart submission**

   * Ensure `upload.fields(...)` (Multer) is used in `driverapp.js` so Express does not try to parse `multipart/form-data` as JSON.

2. **403 on admin routes**

   * Confirm your email is in `ADMIN_EMAILS` in **both** `auth.js` and `requireAdmin.js`, and restart server.
   * If you already signed in as a non-admin, delete your user document from MongoDB (see “Option B” above).

3. **Session/CORS issues**

   * Backend must include:

     ```js
     app.use(cors({ origin: "http://localhost:5173", credentials: true }));
     app.use(cookieParser());
     app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: "lax" } }));
     ```
   * Frontend fetch calls must use `credentials: "include"`.

4. **MongoDB connection errors**

   * Check `MONGODB_URI` in `server/.env`.

5. **MIME-type rejections**

   * Multer’s fileFilter only allows JPEG, PNG, GIF, PDF. Uploading other types gives a 400 JSON error.

6. **Google OAuth “redirect\_uri\_mismatch”**

   * In Google Cloud Console, set:

     * Authorized JS origin: `http://localhost:5173`
     * Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   * The Client ID in `secrets.js` must match the one in Google Cloud.

---

## Summary

1. **Clone**

   ```bash
   git clone <repo-url>
   cd CS35L_Van-Scheduling
   ```

2. **Configure server**

   ```bash
   cd server
   cp .env.example .env
   # set MONGODB_URI="mongodb://localhost:27017/35ldb"
   npm install
   ```

3. **Configure client & run**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Run server**

   ```bash
   cd server
   node server.js
   ```

5. **Visit** `http://localhost:5173`, sign in with Google, test “Admin Tools” (after adding your email to `ADMIN_EMAILS` as described).
