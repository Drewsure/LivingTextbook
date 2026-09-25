# DR-1212: Explicit Local-Bundle Cache Policy

Offline-ready local bundle manifests now require a versioned, route-allowlisted
cache policy that excludes learner data and keeps background sync disabled.
The policy version must match the bundle version, review-only manifests cannot
claim offline-ready caching, and source-document assets cannot be precached.
Every declared local QR fallback route must also be covered by the policy route
allowlist. Validation is review-only and does not register workers or mutate
caches.

References: ADR 1212 and the 2026-09-25 local-bundle-cache-policy build
session.
