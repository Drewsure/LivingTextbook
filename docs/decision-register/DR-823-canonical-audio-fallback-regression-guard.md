# DR-823: Canonical Audio Fallback Regression Guard

Canonical integration verification rejects learner-facing audio language
expressions that fall back directly to English inside a game wrapper. The
English baseline remains valid only at the explicit target-language resolver
boundary. This does not authorize persistence, report export, progression,
rewards, assignment, or Phaser source promotion. See ADR 0749.
