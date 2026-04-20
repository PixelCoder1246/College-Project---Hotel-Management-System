# Setup & Installation Guide

This guide provides step-by-step instructions for setting up the Hotel Management System (v0.1.2) on your local machine.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **PostgreSQL**: Local instance or a cloud database like Supabase.

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/PixelCoder1246/College-Project---Hotel-Management-System.git
cd College-Project---Hotel-Management-System
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the `backend/` folder based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db?sslmode=require"
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET="your_long_random_secret"

# Email Configuration
DEV_SKIP_EMAIL=true # Set to false if you want to test actual emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Database Migration
Push the Prisma schema to your database.

```bash
npx prisma db push
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd ../frontend
npm install
```

---

## 🛠️ Running the Application

### Start Backend (Dev Mode)
```bash
# In /backend directory
npm run dev
```
The API will be available at `http://localhost:3000`.

### Start Frontend (Dev Mode)
```bash
# In /frontend directory
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🧪 Verification

1. Open `http://localhost:5173` in your browser.
2. You should see the Landing Page.
3. Try registering a new user.
4. If `DEV_SKIP_EMAIL=true`, check the backend console for the generated OTP code.
5. Verify the OTP to access the dashboard.
```
