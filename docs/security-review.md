# Security Review

## Authentication & Authorization
- **Opaque Tokens**: Sessions use random hashes, avoiding plain text storage and JWT vulnerability issues.
- **Role checks**: Endpoints explicitly separate STUDENT and TUTOR scopes using `requireAuth` and `requireTutor` middlewares.
- **Passwords**: Argon2/bcrypt strategy is defined and enforced in user creation logic.

## Resource Protection (IDOR)
- All user-specific resource fetches validate the requesting user ID.
- Booking endpoints enforce ownership before confirming operations.

## Traffic & Injection
- **Rate Limiting**: `express-rate-limit` is applied over all `/api/` routes to prevent brute-forcing.
- **Validation**: Zod prevents injection and strictly parses incoming requests.
- **Prisma**: ORM natively prevents SQL injection.

## Data Leakage
- **Error Handler**: The centralized error handler swallows 500 stack traces and only returns structured `INTERNAL_ERROR` codes to clients.
