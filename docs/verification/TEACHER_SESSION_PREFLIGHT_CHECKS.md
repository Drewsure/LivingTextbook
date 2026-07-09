# Teacher Session Preflight Checks

Run these checks when teacher session preflight changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

Confirm:

- The session preflight panel appears before the detailed teacher monitor.
- The panel shows passing, warning, and blocked counts.
- Settings safety passes.
- Settings persistence warns that durable launch-session storage is still needed.
- Lifecycle controls warn that persistence/policy is still needed.
- Report export warns that policy and persistence are required.

## Product Checks

- The panel does not imply live production reporting exists.
- The panel does not enable export.
- Raw audio and transcripts remain excluded from core reports.
- Assist-language progression restrictions remain visible in the monitor flow.
