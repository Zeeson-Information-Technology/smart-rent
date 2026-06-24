# Database Layer

Database-facing code belongs here.

- `models`: Mongoose model definitions.
- `repositories`: Persistence operations that should not leak into UI or route handlers.
- `transactions`: Transaction/session helpers.
- `types`: Database-specific TypeScript contracts.

The low-level Mongoose connection adapter remains in `src/lib/db`.