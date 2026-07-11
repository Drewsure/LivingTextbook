# DR-132: Local Companion Generated Manifest Snapshot

## Decision

Add a generated manifest snapshot to the local companion preview route.

## Reason

Publishers and future implementers need to see the machine-readable package shape before a real exporter exists. A read-only snapshot makes the local companion path more concrete without implying an offline-ready installer.

## Standard

- `/local/sample-publisher` shows `Generated manifest snapshot`.
- The snapshot includes bundle id, tenant name, version, readiness, offline-ready gate, content path, media root, hosted redirect, AI Tutor flag, assets, routes, and handoff items.
- The snapshot is preview-only and must not be treated as a signed package manifest.
- The active route verifier checks the snapshot remains visible.
