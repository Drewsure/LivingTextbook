# Build Session: Explicit Local-Bundle Cache Policy

- Added a shared local-bundle cache-policy type and validator.
- Required a complete offline-ready cache policy before a manifest can claim
  offline readiness.
- Added route and asset-kind allowlists, learner-data exclusion, versioned
  cache identity, and disabled background sync.
- Added runtime coverage for missing policy, valid policy, and existing rights,
  checksum, scan, mapping, audio, video, image, and path failures.
- Preserved review-only behavior with no service-worker registration, cache
  mutation, media precache, background sync, or learner-data storage.
- Added ADR 1212 and DR-1212.
