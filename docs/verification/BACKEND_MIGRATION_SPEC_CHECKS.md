# Backend Migration Specification Checks

Run these checks when backend migration specs change.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- The page loads without a runtime error.
- The backend migration specifications panel appears after migration candidates.
- The panel says the specs are vendor-neutral/no vendor lock.
- Tenant entitlement, package release, package game/audio coverage snapshot, permanent QR alias, and progress event stream specs are visible.
- Progress event stream is marked policy-blocked.
- Each spec names fields, indexes, retention, export, local fallback, and policy blockers.

## Product Checks

- No spec creates a real backend dependency.
- No spec stores raw learner audio.
- No spec stores raw AI Tutor transcripts.
- No spec stores unreviewed PDF source as student-facing content.
- Tenant and package records preserve white-label boundaries.
- Local fallback language remains visible where relevant.
