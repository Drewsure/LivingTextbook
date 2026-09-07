# ADR-0505: Ingestion, Asset, And Release Behavior Verification

Status: Accepted

## Context

The white-label platform is being prepared to accept textbook source material and tenant-owned images, audio, video, and font assets. The foundation must prove that these inputs remain review-only and cannot quietly become student-facing content through an upload, extraction, or release shortcut.

## Decision

Extend the local compiled-contract behavior harness to exercise the shared asset, source, and release runtime boundaries alongside progression, recovery, reward, and entitlement.

The harness covers:

- learner-recorded media rejection at the asset boundary;
- raw source files rejected as student payloads at the source boundary;
- a complete release evidence case accepted by validation while the review-only adapter still returns no side effect.

## Consequences

- Multimedia and textbook-ingestion safety has executable evidence, not only source markers and UI review text.
- The harness remains provider-neutral and does not upload, extract, store, publish, mutate QR routes, or activate releases.
- Future live providers must pass the same shared runtime contracts before implementation can replace the review-only adapters.
