# DR-842: Flashcard Entry Idempotence

Repeated completed Flashcard entry submissions must remain completed while
awarding zero additional Star Dust and emitting no duplicate completion or
unlock events. This protects teacher-QR onboarding from double taps, refreshes,
retries, and replayed requests. It does not authorize persistence, assignment,
or Phaser source promotion. See ADR 0765.
