# Build Session Note: Prototype Intake Queue Storage Contract

## Summary

Added a backend-neutral storage contract for prototype intake queue items.

## Why

Z.ai and outside game builds should be useful future inventory, but they must not become direct app imports or route replacements. The queue needs durable hosted/local vocabulary before any controlled return-review or wrapper-review workflow can exist.

## Changed

- Added `prototype_intake_queue_item` to the backend schema draft.
- Added migration candidate `m098-prototype-intake-queue-storage`.
- Added migration spec `spec-prototype-intake-queue-item`.
- Added durable record and persistence boundary entries.
- Added hosted/local write-intent placeholders.
- Added shared validator flags for queue preservation and blocked direct import/route replacement.
- Updated backend storage, prototype review, and active route verifiers.

## Still Blocked

- Direct prototype import.
- App file writes.
- Active route replacement.
- Scoring profile mutation.
- Reward inventory writes.
- Playlist writes.
- Package promotion.
- Student assignment.
- Support-language progress.
