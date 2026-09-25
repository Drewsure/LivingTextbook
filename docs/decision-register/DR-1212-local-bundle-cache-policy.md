# DR-1212: Explicit Local-Bundle Cache Policy

Offline-ready local bundle manifests now require a versioned, route-allowlisted
cache policy that excludes learner data and keeps background sync disabled.
Validation is review-only and does not register workers or mutate caches.

References: ADR 1212 and the 2026-09-25 local-bundle-cache-policy build
session.
