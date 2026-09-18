# Pilot Handoff Shared Validator Checks

The pilot handoff validator is accepted only when:

- a valid review-only package produces no findings;
- non-review mode is rejected;
- missing front-door coverage is rejected;
- a non-blocked student-data decision is rejected;
- the teacher pilot route renders the validator status;
- typecheck, production build, and active-route checks remain green.

This verifies package coherence only. It does not authorize classroom launch,
storage, export, publication, policy acceptance, or live learner data.
