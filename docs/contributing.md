# Contributing Guidelines

Thank you for your interest in contributing to the Hotel Management System! We follow a strict set of standards to maintain code quality and project consistency.

## 🌿 Branching Strategy

- **Main Branch**: Production-ready code. Never push directly to `main`.
- **Feature Branches**: `feat/description-of-feature`
- **Bug Fix Branches**: `fix/description-of-bug`
- **Documentation Branches**: `docs/description-of-change`

---

## 🛠️ Development Workflow

1. **Fork/Clone** the repository.
2. **Create a branch** for your specific task.
3. **Commit** your changes with clear, descriptive messages.
4. **Push** your branch to the remote repository.
5. **Open a Pull Request** against the `main` branch.

---

## 🎨 Code Standards

### JavaScript/TypeScript
- Use **functional components** for React.
- Use **Prettier** for consistent formatting.
- Follow **ESLint** rules (run `npm run lint` before committing).
- Keep functions small and focused on a single responsibility.

### Styling
- We use **Premium Vanilla CSS** with a focus on Glassmorphism.
- Avoid inline styles where possible.
- Use the predefined design tokens in `index.css`.

---

## 📝 Commit Messages

We prefer descriptive commit messages:
- `auth: add JWT token expiration handling`
- `ui: improve dashboard glassmorphism effect`
- `fix: resolve OTP expiry validation bug`
- `docs: update setup guide for Supabase`

---

## 🧪 Testing

- Ensure your changes do not break existing functionality.
- Manual verification is required for all UI changes across mobile and desktop views.
```
