# DR-275: Class Roster Plan Storage Contract

Date: 2026-07-17

## Decision

Create a backend-neutral storage contract for `class_roster_plan`.

## Rationale

Class rosters are central to teacher-led QR onboarding, assignment progress, local classroom deployments, and future reports. Without a durable contract, roster work could quietly turn into real-name storage, family contact storage, speech transcript storage, or report export before school policy and persistence decisions are ready.

## Guardrails

- Roster plans store coded learner slots, not real learner names.
- Family contact information stays out of the roster plan.
- Raw microphone audio and speech transcripts stay out of the roster plan.
- Production student accounts are not created by this foundation record.
- Live report export remains blocked.
- Hosted and closed/local deployments use the same roster storage vocabulary.

## Verification

`npm run verify:class-roster`, `npm run verify:backend-storage`, and `npm run verify:foundation` must pass after class roster plan storage changes.
