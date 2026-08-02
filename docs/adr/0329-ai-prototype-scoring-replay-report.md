# ADR 0329: AI Prototype Scoring Replay Report

## Status

Accepted

## Context

Returned game prototypes can appear playable while quietly owning score, Star Dust, mastery, reward, or package state. That would break the LivingTextbook foundation because scoring must stay deterministic, target-language-driven, parent-engine-owned, and reviewable by teachers.

Support-language audio, background media, and passive listening must remain support-only. Collection mechanics must stay earned and deterministic rather than random or pressure-based.

## Decision

Add review-only AI prototype scoring replay reports to `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

The report must show source records, parent scoring profile policy, mastery policy, reward boundary policy, scoring purpose, score replay checks, mastery replay checks, reward boundary checks, mode-level replay reports, failure triggers, and blocked actions.

## Consequences

- Returned prototypes must prove deterministic scoring replay against `game_scoring_profile_snapshot`.
- Parent engines keep score, Star Dust, mastery, reward, and collection authority.
- The 1,000 Star Dust cap and 75% mastery rule remain platform rules.
- Support-language-only and media-only activity cannot become mastery or Star Dust.
- Random rewards, generated gacha, reward inventory writes, package promotion, and assignments remain blocked.
- MiniStar Japanese support-language scoring and release remain blocked while English is the target-language trigger.
