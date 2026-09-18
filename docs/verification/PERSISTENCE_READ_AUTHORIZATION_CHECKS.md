# Hosted Persistence Read Authorization Checks

## Purpose

Protect hosted progression records from unauthenticated lookup while keeping
the teacher workbench's adapter probe useful and read-only.

## Required invariants

- Every progression read declares `student-continuity` or
  `teacher-review-probe`.
- Student continuity reads require a matching signed student session or a
  server-only persistence token.
- Teacher review probes require a tenant-scoped teacher review session.
- Missing or unknown access purpose fails closed before provider lookup.
- Unauthorized responses do not disclose record existence.
- Browser clients render unauthorized, no-record, and unavailable results as
  distinct states.
- The rule applies equally to process-memory rehearsal and durable SQLite.

## Verification command

```text
npm run verify:persistence-runtime
```

Run the focused check with web typecheck, production build, and active route
verification before persistence is considered pilot-ready.
