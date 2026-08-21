# ADR 0391: Game Mode Settings Storage Readiness

Status: Accepted

Context: The platform now has review-only game mode settings profiles. The next risk is persistence: future teacher controls could be saved in a way that is tenant-specific, backend-specific, or unsafe for young learners.

Decision: add a review-only storage readiness packet that names the future backend-neutral records and hosted/local write intents. The packet is visible on teacher intake and verified by `npm run verify:game-settings`, but it performs no writes.

Consequences:

- Future hosted and closed-local deployments have the same record vocabulary.
- Timer, difficulty, motion, attempts, background media, and skin changes stay policy-gated.
- Settings cannot override scoring profiles or make support-language/media-only actions count as progress.
- Learning audio priority is recorded as a storage acceptance rule before background media or celebration sounds become configurable.
