# Build session: Quarantine evidence adjudication

- Added a tenant-scoped, immutable metadata-only evidence review sidecar for
  quarantined publisher sources and media.
- Added an explicitly gated teacher capture route and handoff panel for scan,
  rights, source-review, target-mapping, accessibility, and release evidence.
- Bound the evidence record into the live evidence preview, package handoff,
  package review packet, and readiness routes.
- Preserved the separate promotion-adapter, assembly, release, QR, hosted,
  and student-use gates. No payload is promoted or mutated by this slice.
- Added focused verification and extended the publisher intake rehearsal to
  prove evidence-ready admission while the separate promotion gate remains.
- Human action remains required for actual publisher rights and release
  adjudication. Z.ai/Phaser source remains isolated until a complete candidate
  `evidence/return-package.json` is supplied and reviewed.
