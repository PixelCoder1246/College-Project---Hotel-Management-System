# Database Schema Documentation

This document describes the database schema used by the Hotel Management System (v0.1.3).

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
| `phone` | `String?` | | User phone number. |
| `address` | `String?` | | User home address. |
| `bio` | `String?` | | Short user biography. |
| `profilePic` | `String?` | | URL to the user's profile picture. |
| `otpCode` | `String?` | | Current 6-digit OTP code for verification. |
| `otpExpiry` | `DateTime?` | | Expiration timestamp for the OTP. |
| `trustedTokens` | `String[]` | | List of JWT tokens from trusted devices/browsers. |
| `createdAt` | `DateTime` | `@default(now())` | Record creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Record last update timestamp. |

### 2. Booking
Stores reservations made by users.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(uuid())` | Primary Key. Global unique identifier. |
| `checkIn` | `DateTime` | | Reservation start date. |
| `checkOut` | `DateTime` | | Reservation end date. |
| `totalPrice` | `Float` | | Total cost of the stay. |
| `status` | `BookingStatus` | `default(PENDING)` | Current status of the reservation. |
| `userId` | `String` | | Foreign Key to the User model. |
| `createdAt` | `DateTime` | `@default(now())` | Record creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Record last update timestamp. |

---

## 🎭 Enums

### Role
Defines the access level of a user.

- `CUSTOMER`: Standard guest user. Can book rooms and view own payments.
- `STAFF`: Hotel employee. Can manage bookings, view analytics, and process payments.
- `ADMIN`: Full system access. Can manage staff and view global reports.

### BookingStatus
Defines the current state of a reservation.

- `PENDING`: Waiting for manual confirmation or payment.
- `CONFIRMED`: Reservation is active and valid.
- `CANCELLED`: User or system cancelled the reservation.
- `COMPLETED`: Guest has checked out and the stay is over.

---

## 🗺️ Visual Representation

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER {
        string id PK
        string name
        string email UK
        string password
        ROLE role
        string phone
        string address
        string bio
        string profilePic
        string otpCode
        datetime otpExpiry
        stringArray trustedTokens
        datetime createdAt
        datetime updatedAt
    }

    BOOKING {
        string id PK
        datetime checkIn
        datetime checkOut
        float totalPrice
        BOOKING_STATUS status
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
```
