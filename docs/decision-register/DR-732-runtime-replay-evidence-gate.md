# DR-732: Runtime Replay Evidence Gate

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / canonical game integration

The shared canonical event validator now requires `replay-v1:` evidence on
all required learning events and `audio_requested` events. This makes replay
identity a runtime completion invariant rather than only a source-review
expectation. No scoring, reward, persistence, or Phaser promotion behavior
changed.

Related ADR: `docs/adr/0660-runtime-replay-evidence-gate.md`.
