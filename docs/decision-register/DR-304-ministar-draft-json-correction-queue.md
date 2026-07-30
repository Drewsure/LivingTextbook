# DR-304: MiniStar Draft JSON Correction Queue

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only MiniStar Draft JSON preview and derived correction queue for the Level 1 greetings generator request.

White-label impact: Positive. MiniStar now proves the tenant-specific generated payload shape without hard-coding MiniStar rules into the platform-wide generator.

Cost impact: Positive. The preview creates no live model call, voice generation, storage write, verifier submission, route, playlist, or assignment.

Constraints:

- English target-language events remain the only progress trigger.
- Japanese support remains support-only and hiragana-only for the Foundation sample.
- Target-language audio cues are required but not approved.
- The correction queue is review evidence only; it cannot auto-fix, regenerate with live AI, assemble packages, create routes, create playlists, or assign students.
- This decision is recorded in `docs/adr/0304-ministar-draft-json-correction-queue.md`.
