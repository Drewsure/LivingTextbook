# ADR 0392: Game Mode Settings Backend Contract

Status: Accepted

Context: Game mode settings profiles and storage readiness are now visible in the teacher intake foundation. The next architectural risk is that a future implementation could persist teacher choices with backend-specific records or with incomplete safety flags.

Decision: make game mode settings part of the backend-neutral storage contract. The platform now names schema entities, migration candidates, migration specs, persistence adapter write intents, content-model categories, and acceptance flags for settings profile, teacher snapshot, and settings change-request records.

Consequences:

- Hosted and closed-local deployments share one record vocabulary before vendor selection.
- Timer, difficulty, motion, attempts, background media, skin, and arcade speed controls remain policy-gated until the persistence path is accepted.
- Settings records preserve learning-audio priority, target-language-only progress, support-language support-only rules, accessibility review, release-control binding, deterministic scoring ownership, and safe defaults.
- The contract is enforced by `npm run verify:backend-storage` and included in `npm run verify:foundation`.
