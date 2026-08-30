# DR-532: Game Completion Offer-Map Next Path

Status: Accepted

Decision: The shared game completion card should prefer reviewed unit game offer maps for next-activity suggestions and fall back to launch-session recommendations only when no offer map exists.

Reasoning:

- The offer map carries game readiness, availability, route, audio, reporting, and guardrail context.
- Completion cards are part of student progression, so they should not drift from teacher-reviewed pathways.
- Launch-session recommendations remain useful as a fallback for incomplete or legacy packages.

Rules:

- Hidden, blocked, premium, teacher-only, or not-ready offers are not suggested as the next student activity.
- Completion cards can show the source of the next suggestion.
- Completion cards cannot write routes, publish games, change scoring, or unlock teacher-only/premium offers.

Verification:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
