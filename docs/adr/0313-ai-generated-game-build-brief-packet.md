# ADR 0313: AI Generated Game Build Brief Packet

Date: 2026-07-31

## Status

Accepted.

## Context

The platform may use Z.ai or other outside AI builders for isolated game prototypes. Those prototypes are useful only if they obey the LivingTextbook architecture: parent engines, JSON payloads, target-language audio, deterministic scoring, standard events, and review-before-integration.

Loose prompts create a risk of one-off games that look exciting but cannot be integrated safely or cost-effectively.

## Decision

Add review-only AI generated game build brief packets to teacher generator routes. Each packet turns generator records into scoped external prototype instructions with mode, parent engine, JSON fixture shape, `standard_event_contract`, `audio_cue_manifest`, scoring rules, integration notes, deliverables, and blocked actions.

Build briefs cannot promote standalone games, bypass parent engines, write generated routes, override scoring profiles, assign students, or let Phaser prototypes skip the LivingTextbook wrapper and event contract.

MiniStar build briefs must keep Japanese support-language scoring and release blocked.

## Consequences

- External prototype work becomes more useful because it is constrained to real integration needs.
- Codex keeps architecture, schema, event, scoring, audio, and final-review ownership.
- Phaser remains welcome for polish, but only through the parent-engine wrapper and standard event contract.
- The generator route becomes a stronger command center for future build delegation without enabling live generation.
