# ADR 0429: Prototype Return Package Checklist

## Status

Accepted

## Context

The platform now shows a Z.ai intake alert, prototype queue, storage guard, evidence packet flow, and readiness summary. The next gap was practical: when an outside game prototype eventually comes back, reviewers need a visible list of what must be included before return review starts.

Without a return package checklist, a returned prototype could be mistaken for permission to copy files into `apps/web`, create a route, mutate scoring, change audio manifests, or promote a package.

## Decision

Add a review-only returned prototype package checklist to the game-readiness workbench and tenant prototype review workbenches. The checklist names source archive manifest, reviewed fixture, event/scoring replay, target-language audio map, mobile accessibility capture, wrapper boundary notes, required-before-Codex-review conditions, and blocked actions.

The checklist is not a file uploader, archive importer, task export, approval action, or app patch plan.

## Consequences

- Codex can later tell the user exactly when Z.ai or another external builder should submit prototype evidence.
- DOM reference and Phaser candidates have different return evidence expectations.
- White-label tenants can use external builders without letting builder-specific code own platform routes, scoring, audio, or rewards.
- The platform avoids storage, malware scan, archive processing, and rights-review cost until a real intake workflow is intentionally designed.
