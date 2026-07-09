# QR Print Readiness Checks

Run these checks when QR print readiness changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- QR print readiness appears after edition QR aliases.
- Sample publisher and MiniStar records are draft-only.
- Direct media-file QR is blocked.
- Alias persistence blockers are visible.
- Media rights blockers are visible.
- No panel text implies production QR printing is already safe.

## Product Checks

- QR print readiness keeps demo classroom use separate from long-lived textbook printing.
- Raw local file paths remain blocked.
- Durable alias persistence remains required before print.
