# DR-167: Class Roster Readiness Verifier

Decision: Make class roster identity a foundation verifier, not only a manual panel/checklist.

Rationale: White-label pilots need learner codes and teacher-visible reports, but the foundation must not quietly become an account system or a store for real names, family contact, raw audio, or speech transcripts.

Implications:

- `npm run verify:class-roster` is part of `npm run verify:foundation`.
- Teacher-issued codes remain reporting slots, not production student accounts.
- Backend and migration previews must preserve coded learner identity and exclude raw speech data.
- Microphone practice, speech matching, and optional AI Tutor features need separate policy before storing voice data or transcripts.

Next: Expand this verifier when real persistence, report export, school roster integrations, or premium speech/tutor reporting become implementation work. The first storage expansion is recorded in `DR-275-class-roster-plan-storage-contract.md`.
