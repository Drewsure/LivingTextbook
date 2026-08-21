# DR-470: Report Settings Context Active Route Marker

## Status

Accepted.

## Decision

The active route verifier must require `/teacher/intake` to render `settings_context_summary`.

## Rationale

The backend storage contract now requires report package settings context summaries. The teacher/admin intake page renders backend schema fields as a review surface, so route verification should protect that visibility and prevent a future UI change from hiding the report storage requirement.

## Guardrails

- This is visibility-only.
- It does not enable report export, local report handoff, storage writes, settings save, or scoring changes.
- Settings context remains report-only evidence.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:routes`
