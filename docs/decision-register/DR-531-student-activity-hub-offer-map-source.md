# DR-531: Student Activity Hub Offer-Map Source

Status: Accepted

Decision: Student activity hubs must build reviewed game route cards from the unit game offer map when one exists.

Reasoning:

- The teacher-reviewed offer map already carries availability, readiness, route, audio, media, reporting, and guardrail data.
- Duplicating route lists inside the student hub creates drift as game modes expand.
- White-label tenants need one package-level place to maintain yearly game offerings.

Rules:

- Game route cards may be generated from reviewed offers.
- Training Academy, print, media, and launch routes remain explicit support paths.
- Student cards may show audio and reporting rules, but they do not create scoring authority.
- Missing offer maps may use a fallback list until review data exists.

Verification:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes`
- `npm run verify:review-keys`
