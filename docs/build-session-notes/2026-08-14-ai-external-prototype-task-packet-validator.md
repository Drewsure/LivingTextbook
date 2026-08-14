# 2026-08-14: AI External Prototype Task Packet Validator

## Context

The external prototype task packet turns generated game build briefs into copy-ready Z.ai/outside-builder instructions. It needed a shared guard so those instructions cannot become live handoff or production authority.

## Work Completed

- Added a shared content-model validator for AI external prototype task packets.
- Reused the validator in sample task packet data and the task packet panel.
- Added visible guard blocks and warnings to teacher generator routes.
- Updated generator and route verification so external task guard labels are required.
- Updated the contract, verification checklist, build-session checklist, and decision register.

## Guardrail

External prototype task packets remain review-only. They cannot copy prompts, create issues, export archives, start live handoff, write app files, create routes, mutate scoring or audio, write rewards, create playlists, assemble packages, create student-facing previews, or assign students.
