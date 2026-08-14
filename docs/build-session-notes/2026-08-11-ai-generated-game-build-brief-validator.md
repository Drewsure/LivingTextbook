# 2026-08-11: AI Generated Game Build Brief Validator

## Context

The AI generated game build brief tells Z.ai or another outside builder what to prototype. It needed a shared guard so prototype briefs stay useful without becoming production work orders.

## Work Completed

- Added a shared content-model validator for AI generated game build brief packets.
- Reused the validator in sample build brief data and the build brief panel.
- Added visible guard blocks and warnings to teacher generator routes.
- Updated generator and route verification so build brief guard labels are required.
- Updated the contract, verification checklist, build-session checklist, and decision register.

## Guardrail

Phaser and other richer engines remain allowed for prototype work, but only behind the LivingTextbook parent-engine wrapper, JSON fixture, event, audio, scoring, and integration contracts. A build brief cannot promote a standalone game, write routes, override scoring, create rewards, or assign students.
