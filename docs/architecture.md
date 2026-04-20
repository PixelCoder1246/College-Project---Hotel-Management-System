# System Architecture

This document describes the high-level architecture and design of the Hotel Management System (v0.1.2).

## 🏗️ Overview

The system follows a modern monorepo architecture with a clear separation between the frontend and backend. It leverages a micro-module approach for the backend to ensure scalability and maintainability.

### Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **Security**: JWT, Bcrypt, OTP, RBAC

---

## 📊 System Components

```mermaid
graph TD
    User((User))
    subgraph Frontend
        React[React Dashboard]
        UI[Glassmorphism UI]
    end
    subgraph Backend
        Express[Express API]
        Auth[Auth Module]
        Middleware[Auth Middleware]
    end
    subgraph "Data Layer"
        Prisma[Prisma Client]
        PostgreSQL[(PostgreSQL)]
    end

    User <--> React
    React <--> Express
    Express <--> Auth
    Auth <--> Prisma
    Prisma <--> PostgreSQL
    Express --- Middleware
```

---

## 🔄 Sequence Diagram: Authentication & OTP Flow

The following diagram illustrates the secure registration and verification process.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant E as Email Service

    U->>F: Input Registration Data
    F->>B: POST /api/auth/register
    B->>DB: Check for existing user
    B->>DB: Create user (inactive)
    B->>E: Generate & Send OTP
    B->>F: 201 Created / OTP Sent
    F->>U: Show OTP verification page

    U->>F: Input OTP
    F->>B: POST /api/auth/verify-otp
    B->>DB: Validate OTP & Expiry
    B->>DB: Mark user as verified
    B->>F: 200 OK / JWT Token
    F->>U: Redirect to Dashboard
```

---

## 🏛️ Class Diagram: Backend Module Structure

The backend is structured into logical modules. Each module contains its routes, controller, and service.

```mermaid
classDiagram
    class App {
        +use(middleware)
        +use(authRoutes)
    }

    class AuthRoutes {
        +POST /register
        +POST /login
        +POST /verify-otp
        +GET /me
    }

    class AuthController {
        +register(req, res)
        +login(req, res)
        +verifyOtp(req, res)
        +getMe(req, res)
    }

    class AuthService {
        +createUser(data)
        +validateCredentials(email, password)
        +generateOTP(userId)
        +verifyOTP(userId, code)
    }

    class PrismaClient {
        +user
        +$connect()
    }

    App --> AuthRoutes
    AuthRoutes --> AuthController
    AuthController --> AuthService
    AuthService --> PrismaClient
```

---

## 🎭 Use-Case Diagram: Role-Based Access Control (RBAC)

The system defines three primary roles: **Admin**, **Staff**, and **Customer**.

```mermaid
useCaseDiagram
    actor "Admin" as admin
    actor "Staff" as staff
    actor "Customer" as customer

    package "Hotel Management System" {
        usecase "Room Booking" as UC1
        usecase "Payments" as UC2
        usecase "Manage Staff" as UC3
        usecase "View Analytics" as UC4
        usecase "Self Profile Management" as UC5
    }

    admin --> UC1
    admin --> UC2
    admin --> UC3
    admin --> UC4
    admin --> UC5

    staff --> UC1
    staff --> UC2
    staff --> UC4
    staff --> UC5

    customer --> UC1
    customer --> UC2
    customer --> UC5
```

---

## 📂 Directory Structure

```text
root/
├── backend/            # Express API & Prisma
│   ├── prisma/         # Schema & Migrations
│   └── src/
│       ├── modules/    # Feature-based folders
│       └── middleware/ # Security & Validation
├── frontend/           # React + Vite
│   └── src/
│       ├── pages/      # Dashboard & Auth views
│       └── components/ # UI Components
├── docs/               # Technical Documentation
└── utils/              # Shared Utilities
```
