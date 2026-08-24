# DR-501: Prototype Return Package Checklist Storage Contract

Status: Accepted

Date: 2026-08-25

## Decision

Returned prototype package checklists must have backend-neutral hosted and local storage contracts before returned evidence from Z.ai, Phaser prototypes, DOM reference prototypes, or any outside builder can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work.

## White-Label Impact

Strongly positive. Tenants can use external builders while the platform keeps source snapshots, evidence requirements, language boundaries, scoring, rewards, routes, and package promotion under review control.

## Cost Impact

Positive. The contract prepares hosted and local persistence without paying for archive upload, malware scanning, object storage, or vendor-specific backend work before those capabilities are needed.

## Constraints

- The record stores checklist metadata and evidence requirements only.
- It must preserve source archive manifest requirements, reviewed fixture folder requirements, event/scoring replay requirements, target-language audio coverage, mobile accessibility capture, wrapper boundary notes, required-before-Codex-review conditions, and blocked actions.
- It must block archive import, direct app file copy, active route replacement, scoring mutation, reward inventory writes, playlist creation, package promotion, student assignment, and support-language progress.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:prototype-review`
- `npm run verify:routes`
