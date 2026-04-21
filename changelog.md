# Changelog

All notable changes to this project will be documented in this file.

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
