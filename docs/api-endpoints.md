# API Endpoints Documentation

This document lists all available REST API endpoints for the Hotel Management System (v2.0.0).

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

## 🏨 Room Endpoints

All room-related endpoints are prefixed with `/rooms`.

### 1. Get All Rooms
Fetches a list of all rooms with optional filtering.

- **URL**: `/rooms`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `type`: SINGLE, DOUBLE, DELUXE, SUITE
  - `status`: AVAILABLE, BOOKED, MAINTENANCE
  - `minPrice`: Minimum price per night.
  - `maxPrice`: Maximum price per night.
  - `capacity`: Minimum guest capacity.
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "rooms": [
          { "id": "...", "roomNumber": "101", "type": "DELUXE", "price": 150.0, "status": "AVAILABLE", "capacity": 2 }
        ]
      },
      "message": "Rooms fetched successfully"
    }
    ```

### 2. Get Room Details
Fetches details of a specific room.

- **URL**: `/rooms/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "room": { ... }
      },
      "message": "Room fetched successfully"
    }
    ```

### 3. Add Room
Adds a new room to the system.

- **URL**: `/rooms`
- **Method**: `POST`
- **Auth Required**: Yes (Admin or Staff)
- **Request Body**:
  ```json
  {
    "roomNumber": "101",
    "type": "DELUXE",
    "price": 150.0,
    "capacity": 2
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "room": { ... } },
      "message": "Room added successfully"
    }
    ```

### 4. Update Room
Updates an existing room's details.

- **URL**: `/rooms/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin or Staff)
- **Request Body**: (Any combination of)
  ```json
  {
    "price": 160.0,
    "status": "MAINTENANCE"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "room": { ... } },
      "message": "Room updated successfully"
    }
    ```

### 5. Delete Room
Removes a room from the system.

- **URL**: `/rooms/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin or Staff)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": null,
      "message": "Room deleted successfully"
    }
    ```

---

## 📅 Booking Endpoints

All booking-related endpoints are prefixed with `/bookings`. All endpoints require **Authentication**.

### 1. Check Availability
Checks if a specific room is available for a given date range.

- **URL**: `/bookings/check-availability`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `roomId`: UUID of the room.
  - `checkIn`: Check-in date (ISO8601).
  - `checkOut`: Check-out date (ISO8601).
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "isAvailable": true },
      "message": "Room is available"
    }
    ```

### 2. Create Booking
Creates a new reservation for the authenticated user.

- **URL**: `/bookings`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "roomId": "...",
    "checkIn": "2026-05-01",
    "checkOut": "2026-05-05"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "booking": { ... } },
      "message": "Booking created successfully"
    }
    ```

### 3. Get Booking Details
Fetches details of a specific booking.

- **URL**: `/bookings/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "booking": { ... } },
      "message": "Booking fetched successfully"
    }
    ```

### 4. Update Booking
Modifies an existing booking. Re-validates availability if dates are changed.

- **URL**: `/bookings/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**: (Optional fields)
  ```json
  {
    "checkIn": "...",
    "checkOut": "...",
    "roomId": "...",
    "status": "CONFIRMED"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": { "booking": { ... } },
      "message": "Booking updated successfully"
    }
    ```

### 5. Cancel Booking
Cancels an existing reservation.

- **URL**: `/bookings/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": null,
      "message": "Booking cancelled successfully"
    }
    ```

---

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
