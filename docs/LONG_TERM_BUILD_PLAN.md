# Living Textbook Long-Term Build Plan

Status: active governed roadmap  
Product: saleable white-label Living Textbook platform  
Flagship tenant: MiniStar English Global Lab

This document is the current phase map. `docs/BLUEPLAN.md`, the Principles and
Standards document, ADRs, the decision register, and verification records remain
the detailed authorities. A green scaffold or preview is not production
approval.

## North-star outcome

Deliver a tenant-configurable platform that publishers and schools can brand,
populate, deploy, and operate with teacher QR onboarding, student
self-progression, reviewed textbook/media intake, reusable game engines,
deterministic mastery and earned collections, teacher reporting, language
policy, optional paid AI services, closed local deployment, offline fallback,
and opt-in hosted persistence.

## Governed phases

| Phase | Current position | Exit evidence |
| --- | --- | --- |
| Foundation hardening | Verified scaffold | Typecheck, production build, route, runtime, privacy, tenant, audio, upload, and security gates all pass. |
| Canonical game integration | Canonical route family is ready; external Phaser promotion is blocked | A named candidate passes provenance, fixture, event, audio, scoring, accessibility, wrapper, privacy, tenant, and integration review. |
| Controlled pilot release | Rehearsal and handoff evidence exist; launch remains blocked | Human review, school policy, package, deployment, persistence, browser, and pilot gates are accepted for one tenant/package. |
| Publisher content pipeline | Review-only PDF/text, media, asset, language, and activity pathways exist | A real publisher package passes lineage, rights, scan, accessibility, content, audio, compatibility, and release review. |
| Production persistence and deployment | Provider-neutral hosted/local adapters and recovery rehearsals exist | A deployment profile, provider, retention policy, authorization model, migration, backup, restore, and rollback are explicitly accepted. |
| Accessibility and localization | Target/support language rules and audio-first contracts are implemented in the scaffold | Browser evidence proves keyboard, touch, focus, reduced motion, readable fallback, audio coverage, script policy, and tenant language isolation. |
| Optional AI services | AI authoring, AI Tutor, speech, cost, and entitlement boundaries are review-only | A tenant opts in with budget, privacy, model, retention, human-review, failure, and student-safety evidence. |
| Release readiness | Evidence-led decision workbench exists; approval and promotion remain blocked | Every required phase has matching tenant/package evidence, an adult decision, rollback, and deployment verification. |

## Current hard gate

The first external game candidate is Memory Match from
`Drewsure/ministar-lab`. The frozen snapshot is provenance only. Z.ai must
return a separate package containing `evidence/return-package.json` before
Codex can open candidate review or propose a wrapper adapter.

The human procedure is:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
& .\scripts\verify-zai-memory-match-package.ps1 -PackageRoot "D:\LIVING TEXTBOOOK PROJECT\zai-review\memory-match-candidate-2026-09-25"
```

The helper and canonical verifier must pass before any source is inspected for
integration. No source copy, route replacement, score mutation, audio-manifest
mutation, persistence ownership, package promotion, or student assignment is
permitted at this gate.

## Work sequencing rule

1. Keep shared contracts, tenant boundaries, evidence, and failure behavior
   correct.
2. Complete one vertical slice through content, audio, game, progression,
   teacher evidence, and deployment boundaries.
3. Review an external candidate only when its complete evidence package exists.
4. Integrate through a parent-engine wrapper only after Codex adjudication.
5. Run browser and privacy/tenant negative evidence before pilot promotion.
6. Enable real writes, uploads, assignments, and paid services only after the
   named human owner accepts the relevant policy and rollback records.

## Non-negotiable boundaries

- MiniStar configuration is a tenant, not a universal platform assumption.
- English/target-language evidence triggers progression; support-language use
  never unlocks progress by itself.
- Rewards are deterministic, mastery-earned collections, never pressure-based
  or purchase-like random progression.
- Learning audio has priority over optional background media.
- External Phaser source remains isolated until its complete return review.
- Review-only readiness must never masquerade as production capability.
