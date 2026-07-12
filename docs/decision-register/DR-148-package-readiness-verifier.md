# DR-148: Package Readiness Verifier

## Decision

Treat sample tenant package readiness as a foundation verification gate.

## Rationale

White-label pilots depend on more than route availability. A package must keep reviewed content, active game/audio coverage, media rights fields, teacher-gated background media, front-door QR/access policy, teacher report routes, and optional premium AI Tutor policy aligned. These are saleability and partner-confidence requirements, so they should fail fast in verification.

## Accepted Direction

- Add `npm run verify:package-readiness`.
- Include the package-readiness verifier in `npm run verify:foundation`.
- Check both MiniStar and the sample publisher package.
- Keep support language as comprehension support only.
- Keep AI Tutor optional, premium, and off by default.

## Follow-Up

When real tenant packages are added, extend the verifier from sample packages to package manifests or durable package records instead of relying on hand-picked sample source files.
