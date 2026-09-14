# DR-840: Canonical Flashcard Entry Slice

Flashcards are registered as a separate canonical entry slice because they
open the teacher-QR learner journey through reviewed target-language practice,
not through the ordinary unlocked-game wrapper. The slice must preserve audio
replay, deterministic completion, next-mode policy, and the rule that support
language cannot unlock the next game.

This does not create a new engine, route authority, persistence provider,
assignment path, or Phaser promotion path. See ADR 0763.
