# DR-1260: Publisher Intake Rehearsal

## Decision

Add a repeatable, synthetic publisher-intake rehearsal for the first saleable
white-label pilot. It follows the real intake, handoff, live readiness, and
review-packet boundaries while proving that an unadjudicated source cannot be
assembled or assigned to students.

## Why

Static readiness fixtures prove data shape, but they do not prove that a
publisher submission can travel through the controlled route boundary. A
rehearsal closes that evidence gap without enabling a real upload workflow.

## Guardrails

- Use an ephemeral quarantine root and synthetic PDF bytes only.
- Use the explicit upload-quarantine review token, never a production secret.
- Require blocked status before and after the review-only packet.
- Reject payload, path, credential, learner, download, and activation leakage.
- Keep the rehearsal outside the ordinary composition gate because it starts a
  production server and owns temporary process state.

## Acceptance

The rehearsal is accepted only when intake, handoff, live binding, review
packet, privacy, and cleanup checks all pass.
