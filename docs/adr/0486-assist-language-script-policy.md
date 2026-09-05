# ADR 0486: Assist-Language Script Policy

Status: Accepted

## Decision

Make assist-language script policy a durable content-model field and validate it before a package can be treated as reviewed. Student-visible Japanese plans must declare `scriptPolicy`; named Foundation, Bronze, and Plus bands require `hiragana-only`; and Silver-or-later mixed-script content must declare a reviewed mixed-script or tenant-defined policy.

## Rationale

- The Japanese support rule must survive UI changes, package generation, and future upload workflows.
- A UI-only hiragana convention could be bypassed by a generated or imported content package.
- White-label tenants need a configurable policy rather than a platform-wide Japanese assumption.
- Japanese as a target learning language remains a separate expansion lane with its own segmentation, audio, and input requirements.

## Guardrails

- The validator applies script checks to student-visible assist glosses, not teacher notes or administrative metadata.
- Assist language remains support-only and cannot unlock progression, mastery, rewards, or game access.
- The validator is pure review-time logic; it does not translate, write storage, upload files, or activate a language package.
- `npm run verify:package-readiness`, target-language verification, typecheck, build, and foundation verification protect this boundary.

This decision is recorded in `docs/DECISION_REGISTER.md` DR-557.
