# 🚐 CSC Van Scheduling Web App

A full-stack web application built for the UCLA Community Service Commission (CSC) to manage transportation logistics — including van scheduling, driver application approvals, and van return condition tracking.

---

## 📦 Features

- 🔐 UCLA Email OAuth login (project members & admins)
- 🧾 Driver application form with document upload & auto-approval logic
- 📅 Real-time van scheduling system with conflict checks and waitlists
- ✅ Digital van return form with condition checklists & image uploads
- 📊 Credit score system for project accountability
- 📂 Admin dashboard to view, approve, and track all activity

---

## 🛠 Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React + Vite + Tailwind CSS | Node.js + Express | MongoDB + Mongoose |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wjcheng001/CS35L_Van-Scheduling.git
cd CS35L_Van-Scheduling
````

### 2. Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
node server.js
```
## 🗂 Project Structure

```
csc-van-app/
├── client/          # React frontend (Vite)
├── server/          # Express backend (Node + MongoDB)
├── README.md
├── .gitignore
```

---

## 🧪 Example API Test

```bash
GET http://localhost:3000/api/test
```

Expected response:

```json
{ "message": "Hello from server!" }
```

---

## 📌 Credits

Developed by the CS 35L team (Spring 2025)
UCLA | Community Service Commission

---
