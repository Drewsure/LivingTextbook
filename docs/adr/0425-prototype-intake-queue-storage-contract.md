# ADR 0425: Prototype Intake Queue Storage Contract

## Status

Accepted.

## Context

The app now shows a review-only prototype intake queue for Z.ai and outside game inventory. That queue is visible on `/teacher/game-readiness` and tenant prototype review routes, but without a storage contract it could remain a temporary UI list rather than an auditable foundation record.

The build must eventually support controlled intake of external prototypes while keeping Codex in charge of architecture, schema discipline, wrapper integration, and final merge decisions.

## Decision

Add `prototype_intake_queue_item` as a backend-neutral storage contract with:

- schema draft entry,
- migration candidate `m098-prototype-intake-queue-storage`,
- migration spec `spec-prototype-intake-queue-item`,
- durable record `prototype-intake-queue-item-record`,
- persistence boundary `prototype-intake-queue-item-boundary`,
- hosted write intent `hosted-prototype-intake-queue-item-write`,
- local write intent `local-prototype-intake-queue-item-write`,
- verifier coverage in backend storage, prototype review, and active route checks.

## Consequences

The system can preserve ordered outside prototype inventory without importing code, replacing routes, changing scoring, writing rewards, creating playlists, promoting packages, or assigning students.

This does not create a real upload, import, patch, or workflow action. It only prepares the durable review vocabulary for a later controlled intake process.
