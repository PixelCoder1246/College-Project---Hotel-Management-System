# Changelog

All notable changes to this project will be documented in this file.

## [4.1.1] - 2026-04-28

### Added

- **Full UI Redesign — Hotel Booking Website**:
  - Integrated `Playfair Display` serif font for premium hotel branding across all headings.
  - Completely redesigned `LandingPage` with animated hero, room type showcase section, and feature grid.
  - New `Navbar` component with hotel logo, room/features anchor links, and auth-aware actions.
  - Rebuilt `DashboardPage` with role-appropriate welcome banner, info cards, and animated module grid.
  - Redesigned `RoomsPage` with per-type room card gradients (Single/Double/Deluxe/Suite), real-time status pills.
  - Premium `MyBookingsPage` with booking icons, nights calculation, and richer status badges.
  - New `AdminBookingsPage` with status filter, confirm/cancel actions, and guest info display.
  - `RoomManagementPage` rebuilt with a stats summary row and a styled data table.
  - `PaymentPage` fully rewritten with vanilla CSS, premium payment method cards, invoice view.
  - `InvoiceUI` rewritten with vanilla CSS — fixes payment page rendering crash.
  - New `payment.css`, overhauled `global.css`, `landing.css`, `dashboard.css`, `bookings.css`, `rooms.css`.

### Fixed

- **Room Availability Sync**: `createBooking` now atomically sets room status to `BOOKED` via a Prisma transaction. `cancelBooking` restores `AVAILABLE` when no other active bookings exist.
- **Admin Role Access**: Admins and Staff no longer see the `Room Booking` and `My Bookings` modules in the dashboard.
- **Payment Page Crash**: Removed Tailwind utility classes (`bg-white/5`, `text-white/60` etc.) from `PaymentPage` and `InvoiceUI` — these were not installed, causing a render failure.
- **Payment Method Enum Mismatch**: Frontend now maps `"Credit Card"` → `CREDIT_CARD`, `"UPI"` → `UPI`, etc., matching the Prisma `PaymentMethod` enum.
- **Post-Booking Flow**: After a successful booking, users are automatically redirected to the Payment page instead of receiving just a toast notification.

## [4.1.0] - 2026-04-27

### Added

- **Phase 4 Frontend: Payment Integration**:
  - New `PaymentPage` with a beautiful mock payment gateway.
  - Implemented `InvoiceUI` for generating and displaying styled invoices dynamically.
  - Linked `MyBookingsPage` to the payment flow for `PENDING` bookings.
  - Added new React frontend services and typings for Payment integration.
- **Global Updates**:
  - Bumped project version to `4.1.0` across all packages, documentation, and APIs.

## [4.0.0] - 2026-04-27

### Added

- **Phase 4 Backend: Payment Integration & Invoicing**:
  - New `Payment` model with status and method tracking.
  - Automated `Booking` status updates (CONFIRMED) upon successful payment.
  - Secure endpoints for generating dynamic invoices with tax calculations.
  - Mock payment processing logic with transaction ID generation.
  - Project-wide linting and formatting synchronization.
- **Global Updates**:
  - Bumped project version to `4.0.0` across all packages, documentation, and APIs.

## [3.2.0] - 2026-04-21

### Added

- **Frontend: Admin Booking Management**:
  - New `AdminBookingsPage` for staff/admins to view all reservations system-wide.
  - Confirm/Cancel actions on PENDING bookings directly from the dashboard.
  - `GET /api/bookings` endpoint (ADMIN/STAFF only) with optional filters.
  - Restored `getBookingById` and added `getAllBookings` to booking service, controller, and routes.
  - Dashboard module grid redesigned: separated "Room Booking" (customer) from "Manage Rooms" and "Manage Bookings" (staff/admin).

### Fixed

- `ReferenceError: getAllBookings is not defined` in `booking.routes.js` (missing import).
- Cleaned up and deduplicated `booking.service.ts` methods.

## [3.1.0] - 2026-04-21

### Added

- **Phase 3 Frontend: Reservation System & Search**:
  - Premium Room Search interface with real-time capacity and type filtering.
  - Interactive booking confirmation modal with automatic price calculations.
  - "My Bookings" dashboard module for personal reservation management.
  - **Admin Booking Management**: Dedicated dashboard for staff to confirm/cancel guest reservations.
  - Seamless integration with backend reservation overlap protection logic.
  - Standardized project version to `3.1.0` and cleaned up linting across the stack.

## [3.0.0] - 2026-04-21

### Added

- **Phase 3 Backend: Reservation Engine & Overlap Logic**:
  - Precision date-overlap checking to prevent double bookings.
  - Automatic `totalPrice` calculation based on nightly rates.
  - Comprehensive Booking APIs: availability checks, creation, cancellation, and modification.
  - Strict date validation to ensure data integrity.
- **Global Updates**:
  - Bumped project version to `3.0.0` across all packages and documentation.

## [2.0.0] - 2026-04-21

### Added

- **Phase 2 Backend: Room Management System**:
  - Full CRUD implementation for `Room` model.
  - Enhanced room filtering (type, status, price range, capacity).
  - Admin/Staff role-based authorization for room management.
  - Automatic Prisma client synchronization.
- **Global Updates**:
  - Bumped project version to `2.0.0` across all packages and documentation.

## [0.1.3] - 2026-04-20

### Added

- **Phase 1 UI Implementation**:
  - `ProfilePage.tsx`: Premium design with edit profile capabilities.
  - Interactive profile fields correctly mapping `User` model (`phone`, `address`, `bio`, `profilePic`).
  - Booking History UI integrated and structured.
  - `user.service.ts` connecting frontend profile features to backend.
- **Backend Sync**:
  - CORS configurations updated to allow multiple frontend development ports seamlessly (`localhost:5173`, `localhost:5174`).
  - Strict empty-value filtering built into the frontend to cleanly interface with `express-validator`.

### Changed

- Refactored `auth.types.ts` and `user.types.ts` imports for strict typing (`import type`) to prevent Vite hot-reload module syntactical crashes.
- Bumped frontend and backend application versions to `0.1.3`.

## [0.1.2] - 2026-04-20

### Added

- **Project Documentation Suite**:
  - Created a dedicated `docs/` directory.
  - Added `architecture.md` with Mermaid diagrams (Sequence, Class, Use-Case).
  - Added `api-endpoints.md` with request/response specifications.
  - Added `database-schema.md` with Prisma models and ER diagram.
  - Added `setup-guide.md` for local development and environment configuration.
  - Added `contributing.md` for project collaboration standards.
  - Added `user-guide.md` for role-based dashboard instructions.
- **Reference Improvements**:
  - Linked all documentation in the root `README.md`.

### Changed

- Global version bump across all project files (`package.json`, `app.js`, `docs`).
- Updated project metadata to reflect the new documentation milestone.

## [0.1.1] - 2026-04-07

### Added

- **Full-Stack Authentication System**:
  - JWT-based secure authentication flow.
  - Multi-stage Login (Credentials → Email OTP).
  - Trusted Device / "Remember Me" functionality (90-day bypass).
  - Role-Based Access Control (RBAC) middleware for `ADMIN`, `STAFF`, and `CUSTOMER`.
- **Database & Backend**:
  - Prisma ORM integration with Supabase (PostgreSQL).
  - Support for Connection Pooling (Port 6543/5432).
  - Custom email service with HTML templates for OTP delivery.
  - Express-Validator middleware for robust input sanitization.
- **Modern UI/UX**:
  - Premium Glassmorphism design system across all pages.
  - Responsive Landing Page with hotel growth statistics.
  - Protected Dashboard with role-specific module views.
  - Refined Login/Register forms with password strength meters.
- **SEO & Performance**:
  - Semantic HTML5 structure for better accessibility and SEO.
  - Optimized meta tags and Open Graph support.

### Changed

- Refined UI text by removing development-mode placeholders and technical labels.
- Updated `LandingPage` stats to focus on hospitality metrics instead of technical features.

## [0.1.0] - 2026-04-07

### Added

- Initial monorepo directory structure.
- `backend/` for server-side code.
- `frontend/` for client-side code.
- Project structure documentation in `readme.md`.
