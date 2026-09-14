# DR-841: Flashcard Entry Runtime Gate

The Flashcard entry adapter must reject partial target-language engagement
without emitting completion or unlock events. A complete reviewed pass must
award the canonical entry dust, complete Flashcards, and emit unlock events
with support-language unlocking explicitly false.

This keeps teacher-QR onboarding English/target-language triggered while
preserving assist-language support. It does not authorize persistence,
assignment, or Phaser source promotion. See ADR 0764.
