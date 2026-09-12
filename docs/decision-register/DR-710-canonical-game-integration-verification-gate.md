# DR-710: Canonical Game Integration Verification Gate

**Status:** Accepted

Require a dedicated foundation verifier for canonical game components before
the platform expands into additional game modes or reviews a Phaser wrapper.

The verifier currently covers Memory Match and Balloon Pop. It checks shared
start/completion helpers, standard interaction events, learner-audio evidence,
route composition, and the prohibition on direct randomness or browser
persistence inside the canonical components.

This keeps the platform-owned contract testable and keeps Z.ai/Phaser work in
the review lane until an adapter can preserve the same boundaries.

Related ADR: `docs/adr/0638-canonical-game-integration-verification-gate.md`.
