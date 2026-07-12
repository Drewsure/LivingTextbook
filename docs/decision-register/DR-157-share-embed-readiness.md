# DR-157: Share And Embed Readiness

## Decision

Treat private assignment links and stable QR routes as the first sharing model. Keep public sharing, website iframe embeds, and public community discovery blocked until the required access, rights, privacy, reporting, and moderation gates exist.

## Rationale

White-label tenants need sharing, but public links and embeds can leak private packages, expose student reports, weaken rights controls, or create moderation obligations. A focused assignment route gives teachers the useful part first without pretending the public platform is ready.

## Accepted Direction

- Add share/embed readiness planning data.
- Show the readiness plan on `/teacher/intake`.
- Add `npm run verify:share-embed`.
- Include the check in `npm run verify:foundation`.
- Keep private assignment links as the first share path.
- Keep public sharing, iframe embeds, and public community discovery blocked for v1.

## Follow-Up

After auth, persistence, package versioning, and report boundaries are durable, define assignment link records, embed origin policy, public visibility rules, and teacher colleague copy/review flows.
