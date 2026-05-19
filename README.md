# AI Complaint Management System

A production-ready Full Stack MERN (MongoDB, Express, React, Node.js) application integrated with AI (OpenRouter) to automatically analyze, prioritize, and route public complaints.

---

## 📑 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Deployment Guide](#deployment-guide)
8. [Viva Questions & Answers](#viva-questions--answers)

---

## 🚀 Features

### **User Features**
- **Authentication**: JWT-based secure Signup/Login with bcrypt password hashing.
- **Complaint Submission**: Form with validation to register issues (Water, Electricity, etc.).
- **Dashboard**: Track own complaints, view status, and download CSV exports.
- **Responsive UI**: Glassmorphism dark mode UI built with Tailwind CSS.

### **Admin Features**
- **Admin Dashboard**: View system-wide statistics, total complaints, and charts.
- **Status Management**: Update complaint statuses (Pending → In Progress → Resolved).
- **User Management**: Enable or disable user accounts.
- **AI Analysis**: Manually trigger AI analysis for new complaints.

### **AI Features (OpenRouter)**
- Extracts exact **Priority** (Low, Medium, High, Critical) based on text context.
- Assigns the **Responsible Department** automatically.
- Generates a **Summary** and a professional **Auto-Response** message.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios, React Router v7, React Hot Toast, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, express-validator, Helmet, Morgan.
- **AI Integration**: OpenRouter API (`openai/gpt-4o-mini`).
- **Deployment Ready**: Render (`render.yaml` provided).

---

## 📂 Folder Structure

```text
FSD_ESE/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic (auth, complaint, ai)
│   │   ├── middleware/      # JWT auth, error handling, validation
│   │   ├── models/          # Mongoose Schemas (User, Complaint)
│   │   ├── routes/          # Express API routes
│   │   └── utils/           # AI service and token generators
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Express Entry Point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Buttons, Inputs, Modals, Cards)
│   │   ├── context/         # AuthContext (Global state)
│   │   ├── layouts/         # Dashboard Layout (Navbar, Sidebar)
│   │   ├── pages/           # Application Pages
│   │   ├── services/        # Axios API fetchers
│   │   ├── utils/           # Helper functions (dates, formatting)
│   │   ├── App.jsx          # React Router Setup
│   │   └── index.css        # Tailwind Base & Custom Styles
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml              # Render Deployment Config
├── postman_collection.json  # API Collection for testing
└── package.json             # Root monorepo scripts
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI

### 2. Clone and Install
```bash
# Install concurrently at root
npm install

# Install all dependencies (Frontend & Backend)
npm run install:all
```

### 3. Setup Environment Variables
Duplicate `.env.example` to `.env` in both `frontend` and `backend` folders and fill in the values.

**Backend (`backend/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_complaint_db
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_key
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application
```bash
# From the root folder - starts both servers
npm run dev
```
- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:5000`

---

## 📡 API Documentation

### **Auth Routes** (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | Authenticate user | Public |
| GET | `/me` | Get current user | Private |
| GET | `/users` | Get all users | Admin |
| PUT | `/users/:id/toggle` | Enable/Disable user | Admin |

### **Complaint Routes** (`/api/complaints`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Create complaint | Private |
| GET | `/` | Get all complaints (filtered) | Private |
| GET | `/:id` | Get single complaint | Private |
| PUT | `/:id` | Update status/details | Private/Admin |
| DELETE | `/:id` | Delete complaint | Private/Admin |
| GET | `/stats` | Get dashboard statistics | Admin |

### **AI Routes** (`/api/ai`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/analyze` | Analyze complaint & save to DB | Private |

---

## 🚀 Deployment Guide (Render)

This project includes a `render.yaml` file for easy deployment as a Blueprint on Render.com.

1. Push your repository to GitHub.
2. Go to **Render Dashboard** -> **Blueprints** -> **New Blueprint Instance**.
3. Connect your repository.
4. Render will automatically detect the `render.yaml` and create two services:
   - **ai-complaint-api** (Node.js Web Service)
   - **ai-complaint-web** (Static Site for React)
5. Go to the Render Dashboard for the API service and add your `MONGO_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.
6. Update the `VITE_API_URL` on the frontend service to point to your live backend URL.

---

## 🎓 Viva Questions & Answers

**Q1: What is the difference between `res.send()` and `res.json()` in Express?**
> `res.send()` can send Strings, Buffers, Arrays, or Objects and sets the Content-Type automatically based on the data. `res.json()` forces the response to be sent as JSON formatting and always sets the Content-Type to `application/json`.

**Q2: How does JWT Authentication work in this project?**
> When a user logs in, the server creates a token containing the user's `_id` signed with a secret key (`JWT_SECRET`). The client stores this token in `localStorage` and sends it in the `Authorization: Bearer <token>` header for protected routes. The `protect` middleware verifies this signature to grant access.

**Q3: Why did you use `bcryptjs` for password hashing?**
> Storing plain text passwords is a massive security risk. `bcryptjs` hashes the password using a mathematical one-way function and adds a "salt" (random data) to defend against rainbow table attacks. Even if the database is compromised, the original passwords cannot be easily read.

**Q4: How did you implement Role-Based Access Control (RBAC)?**
> The User schema has a `role` enum (`user`, `admin`). I created an `authorizeRoles("admin")` middleware in Express. After the `protect` middleware attaches the logged-in user to `req.user`, the authorize middleware checks if `req.user.role` matches the required role before proceeding to the controller.

**Q5: What is Context API and why is it used here?**
> The React Context API provides a way to pass data through the component tree without having to pass props down manually at every level ("prop drilling"). Here, `AuthContext` holds the logged-in user's state, token, and login/logout functions, making them accessible globally across all pages and components.

**Q6: Explain the MVC architecture used in the backend.**
> MVC stands for Model-View-Controller.
> - **Models** (`/src/models`): Define the database schema and interact with MongoDB using Mongoose.
> - **Controllers** (`/src/controllers`): Contain the core business logic. They take the request, process it using models, and send a response.
> - **Views**: In a MERN stack, the view layer is handled entirely by the React frontend, receiving JSON data from the Express controllers via API routes.
