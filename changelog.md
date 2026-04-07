# Changelog

All notable changes to this project will be documented in this file.

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
