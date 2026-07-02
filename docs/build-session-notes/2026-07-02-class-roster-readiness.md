# Build Session Note: Class Roster Readiness

Date: 2026-07-02

## Purpose

Add a backend-agnostic learner identity boundary before real accounts, persistent class history, or premium AI Tutor reporting are introduced.

## Added

- Shared class roster contract with validation and warning helpers.
- MiniStar, sample publisher, and closed/local classroom sample roster plans.
- Teacher intake roster readiness panel.
- Class roster contract and verification checklist.
- Decision register entry DR-037.

## Product Guardrail

Teacher reports may use codes and progress summaries in the foundation slice. Names, family contact, raw microphone audio, and transcripts remain out of the core roster until policy and persistence decisions are accepted.

## Verification Needed

After local pull:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- Browser check `http://127.0.0.1:3000/teacher/intake`
