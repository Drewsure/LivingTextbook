# DR-529: Multi-Tenant Unit Game Offer Maps

Status: Accepted

Decision: The unit game offer map surface must show both the MiniStar flagship map and at least one non-MiniStar partner map through the same component and shared export.

Reasoning:

- White-label confidence depends on proving that MiniStar is the first tenant, not the platform's only shape.
- Teacher/admin review needs to compare package-specific game offers without route or panel special casing.
- Cost stays lower when additional tenants extend the same offer-map contract instead of creating custom game dashboards.

Rules:

- `sampleUnitGameOfferMaps` must include MiniStar and sample publisher maps.
- Each map must name its tenant id, package id, route expectations, audio requirements, teacher controls, and blocked actions.
- Game-readiness and teacher-intake workbenches may render multiple maps, but remain review-only.
- No map can promote a game, publish a route, import outside code, or change scoring authority.

Verification:

- `npm run verify:package-readiness`
- `npm run verify:routes`
- `npm run verify:review-keys`
