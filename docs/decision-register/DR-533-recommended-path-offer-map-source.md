# DR-533: Recommended Path Offer-Map Source

Status: Accepted

Decision: Recommended game path cards should prefer reviewed unit game offer maps when a content package id is available.

Reasoning:

- Recommended paths are student-facing progression surfaces, so they should not drift from teacher-reviewed game availability.
- Unit game offer maps already hold the richer route, audio, reporting, readiness, and availability rules.
- Launch-session recommendations remain useful as a fallback while package review data matures.

Rules:

- Hidden, blocked, teacher-only, premium, and not-ready offers must not appear as normal recommended student games.
- Recommended path cards may show the reviewed map that sourced the route list.
- The card cannot publish routes, unlock premium features, save settings, write scores, or treat support-language actions as progress.

Verification:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
