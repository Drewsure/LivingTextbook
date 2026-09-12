# DR-741: Report Runtime Canonical Game Gate

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Teacher reporting / canonical game integration

The provider-neutral report runtime now maps canonical game envelopes into the
shared game event shape and validates grouped sequence, replay, tenant, launch,
learner, and completion evidence. Standalone audio remains support-only. This
protects future hosted, local, and hybrid report adapters without enabling
export or persistence. See `docs/adr/0669-report-runtime-canonical-game-gate.md`.
