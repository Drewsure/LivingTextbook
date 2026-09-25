# ADR 1212: Explicit Local-Bundle Cache Policy

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The white-label platform must eventually support closed local deployments and
offline fallback. A manifest flag alone cannot safely authorize service-worker
caching: stale routes, unreviewed media, learner data, and rollback behavior
must be bounded first.

## Decision

Local bundle manifests may declare an optional `cache_policy`. Any manifest
marked `offline_ready` must include a valid `offline-ready` policy with a safe
version and cache name, application route allowlist, asset-kind allowlist,
explicit learner-data exclusion, and disabled background sync. The validator
remains review-only and performs no browser cache or service-worker side
effect.

## Consequences

- Offline readiness cannot be inferred from a boolean alone.
- Future service-worker implementation has a shared, tenant-package-bound
  policy boundary.
- Hosted PWA installability and closed offline learning remain distinct.
- Real cache mutation, media precache, background sync, local learner data,
  installer export, and QR activation remain blocked.

## Verification

The local bundle manifest runtime check rejects missing or malformed cache
policies and accepts a complete structural policy alongside rights, checksum,
scan, mapping, audio, video, and image evidence.
