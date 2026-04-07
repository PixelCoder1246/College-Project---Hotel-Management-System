# Hotel Management System (v0.1.1)

A modern, full-stack hospitality management platform built for speed, security, and premium user experience.

## 🚀 Version 0.1.1 - Authentication Update

The project has reached a major milestone with a production-ready authentication system and a high-end UI design system.

### 🍱 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **Security**: JWT, Bcrypt, OTP, RBAC

### 🌟 Key Features

- **Secure Auth**: JWT-based session management with OTP email verification.
- **RBAC**: Granular dashboard access for Admins, Staff, and Customers.
- **Responsive Design**: Flawless experience on mobile, tablet, and desktop.
- **Hotel Analytics**: Real-time stats and management modules.

## 📂 Project Structure

- **`/backend`**: Express API, Prisma Schema, Auth Middleware, Email Service.
- **`/frontend`**: React Pages (Landing, Login, Register, Dashboard), Context API, Styled Components.
- **`/utils`**: Shared helper functions.

## 🛠️ Getting Started

### 1. Environment Setup

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="your_supabase_pooler_url"
DIRECT_URL="your_supabase_direct_url"
JWT_SECRET="secret_key"
SMTP_USER="your_email"
SMTP_PASS="app_password"
```

### 2. Installation

```bash
# Backend
cd backend
npm install
npx prisma db push

# Frontend
cd ../frontend
npm install
```

### 3. Running Locally

```bash
# Start Backend (Port 3000)
npm run dev

# Start Frontend (Port 5173)
npm run dev
```

---

© 2026 Royal Orchid Elite. Designed for modern hospitality.
e added here)\*
