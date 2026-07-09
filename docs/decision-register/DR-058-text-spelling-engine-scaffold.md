# DR-058: Text-Spelling Engine Scaffold Before Sentence Builder Skin

Date: 2026-07-09

Status: accepted

## Decision

Add a text-spelling parent-engine scaffold using Sentence Builder preview.

## Rationale

Sentence Builder is a core syntax mode, but it should start as a clean engine contract before a polished game surface. This protects audio support, accessibility, scoring, event reporting, and future white-label skins.

## Consequences

- The dashboard now shows the text-spelling engine direction.
- Future Z.ai or Phaser work has a clearer integration target.
- Sentence Builder remains a scaffold, not a finished playable game.
