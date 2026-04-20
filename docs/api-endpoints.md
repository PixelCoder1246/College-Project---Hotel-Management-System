# API Endpoints Documentation

This document lists all available REST API endpoints for the Hotel Management System (v0.1.2).

## 🌍 Base URL
`http://localhost:3000/api`

## 🔐 Authentication Endpoints

All authentication-related endpoints are prefixed with `/auth`.

### 1. Register User
Creates a new account and sends an OTP for verification.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "CUSTOMER" // Optional: CUSTOMER (default), ADMIN, STAFF
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "CUSTOMER" }
      },
      "message": "Account created successfully. Please log in."
    }
    ```

### 2. Login
Authenticates the user. If the device/browser is new, it triggers an OTP.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (OTP Required)**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "requiresOtp": true, "email": "john@example.com" },
      "message": "OTP sent to your email. Please verify."
    }
    ```
- **Success Response (No OTP Required)**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "requiresOtp": false, "token": "jwt_token", "user": { ... } },
      "message": "Login successful."
    }
    ```

### 3. Verify OTP
Verifies the OTP sent to the user's email during login.

- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "token": "jwt_token", "user": { ... } },
      "message": "Login successful. Welcome back!"
    }
    ```

### 4. Get Current User
Fetches the profile of the currently authenticated user.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "user": { ... } },
      "message": "User fetched successfully."
    }
    ```

---

## 👤 User Endpoints

All account and profile-related endpoints are prefixed with `/user`. All require **Authentication**.

### 1. Get Profile
Fetches detailed profile information for the authenticated user.

- **URL**: `/user/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": "...",
          "name": "...",
          "email": "...",
          "role": "...",
          "phone": "...",
          "address": "...",
          "bio": "...",
          "profilePic": "..."
        }
      },
      "message": "Profile fetched successfully"
    }
    ```

### 2. Update Profile
Updates the profile information for the authenticated user.

- **URL**: `/user/profile`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Hotel St",
    "bio": "Loves traveling",
    "profilePic": "https://example.com/pic.jpg"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "user": { ... } },
      "message": "Profile updated successfully"
    }
    ```

### 3. Get Booking History
Fetches the list of bookings made by the authenticated user.

- **URL**: `/user/bookings`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "bookings": [
          {
            "id": "...",
            "checkIn": "...",
            "checkOut": "...",
            "totalPrice": 250.0,
            "status": "CONFIRMED"
          }
        ]
      },
      "message": "Booking history fetched successfully"
    }
    ```

---

## ⚠️ Error Responses

Typical error responses follow this format:

```json
{
  "status": "error",
  "message": "Descriptive error message."
}
```

- **400 Bad Request**: Invalid input data.
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: Resource doesn't exist.
- **422 Unprocessable Entity**: Validation failed.
- **500 Internal Server Error**: Unexpected server error.
```
