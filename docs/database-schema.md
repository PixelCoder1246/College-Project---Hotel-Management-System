# Database Schema Documentation

This document describes the database schema used by the Hotel Management System (v0.1.2).

## 🗄️ Database Provider
- **Type**: PostgreSQL (via Supabase)
- **ORM**: Prisma

---

## 📊 Models

### 1. User
Stores registration and authentication details for all users (Customers, Staff, and Admins).

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(uuid())` | Primary Key. Global unique identifier. |
| `name` | `String` | | Full name of the user. |
| `email` | `String` | `@unique` | Unique login email. |
| `password` | `String` | | Hashed password (Bcrypt). |
| `role` | `Role` | `default(CUSTOMER)` | User privileges (Admin, Staff, Customer). |
| `otpCode` | `String?` | | Current 6-digit OTP code for verification. |
| `otpExpiry` | `DateTime?` | | Expiration timestamp for the OTP. |
| `trustedTokens` | `String[]` | | List of JWT tokens from trusted devices/browsers. |
| `createdAt` | `DateTime` | `@default(now())` | Record creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Record last update timestamp. |

---

## 🎭 Enums

### Role
Defines the access level of a user.

- `CUSTOMER`: Standard guest user. Can book rooms and view own payments.
- `STAFF`: Hotel employee. Can manage bookings, view analytics, and process payments.
- `ADMIN`: Full system access. Can manage staff and view global reports.

---

## 🗺️ Visual Representation

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password
        ROLE role
        string otpCode
        datetime otpExpiry
        stringArray trustedTokens
        datetime createdAt
        datetime updatedAt
    }

    ROLE {
        CUSTOMER
        ADMIN
        STAFF
    }

    USER }|--|| ROLE : has
```
