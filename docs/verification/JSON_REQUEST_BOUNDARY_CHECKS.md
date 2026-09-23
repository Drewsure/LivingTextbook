# JSON Request Boundary Checks

The shared request boundary is required on these browser-facing JSON writes:

- `apps/web/src/app/api/persistence/progression/route.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `apps/web/src/app/api/student/session/route.ts`
- `apps/web/src/app/api/teacher/session/route.ts`

The verifier checks that each route uses
`apps/web/src/server/persistence/requestBoundary.ts` and does not call
`request.json()` directly.

Boundary behavior:

- `application/json` is required.
- Progression and event writes are limited to 128 KiB.
- Student and teacher session creation is limited to 8 KiB.
- Invalid JSON returns `400`.
- Unsupported content type returns `415`.
- Invalid or oversized declared/measured length returns `413`.
- Originless or cross-origin browser mutations return `403`.
- Persistence progression/event writes may use the configured bearer token for
  server-to-server operation; session routes have no browser-origin bypass.

Run:

```text
npm run verify:request-boundary
npm run verify:persistence-runtime
```

This is transport hardening only. It does not enable live persistence or
change the existing tenant authorization and deployment gates.
