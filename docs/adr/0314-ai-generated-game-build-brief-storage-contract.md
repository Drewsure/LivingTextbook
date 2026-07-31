# ADR 0314: AI Generated Game Build Brief Storage Contract

Date: 2026-07-31

## Status

Accepted.

## Context

AI generated game build briefs are intended to help Codex delegate isolated prototype work to Z.ai or other outside builders. The brief packet is useful only if it remains tied to the platform source of truth: parent engines, JSON fixtures, standard events, audio cue manifests, deterministic scoring, and blocked production actions.

Without a storage contract, a generated brief could become an informal prompt that is hard to audit, easy to lose, and too easy to mistake for production-ready work.

## Decision

Add `ai_generated_game_build_brief` / `ai-generated-game-build-brief` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, and persistence boundaries.

The record must preserve the target builder, mode briefs, parent-engine binding, standard event contract, audio cue manifest, deterministic scoring contract, integration notes, deliverables, and blocked build actions.

Hosted and local adapters must block standalone game promotion, Phaser bypass, generated game route writes, scoring profile overrides, direct student assignment, media-only progress shortcuts, and support-language-only scoring or release.

## Consequences

- External prototype briefs become auditable records instead of loose prompt text.
- Phaser remains available for premium game surfaces, but only through LivingTextbook engine, event, audio, and scoring contracts.
- Codex keeps final architecture and integration authority.
- Future AI game generation can scale without creating one-off games that bypass white-label platform rules.
