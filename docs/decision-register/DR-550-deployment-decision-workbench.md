# DR-550: Deployment Decision Workbench

Status: Accepted

Date: 2026-09-03

## Decision

Add a focused `/teacher/deployment` workbench for hosted PWA, local classroom server, and packaged textbook companion decisions.

## Rationale

- The white-label product needs a clean deployment conversation surface for school and publisher pilots.
- Hosted PWA remains the recommended first pilot path because it is faster, cheaper, and easier to support than a local installer or offline package.
- Local classroom server and packaged textbook companion delivery remain visible as future paid or policy-gated options because they matter for publishers with music, video, games, QR codes, and yearly textbook editions.

## Guardrails

- No offline-ready claim.
- No local package activation.
- No installer export.
- No report export.
- No real learner data collection.
- No production QR redirect mutation.
- No student-facing paid feature prompt.
- No media-only progress.
- No support-language-only progression.
- No premium AI Tutor activation.

## Verification

- `npm.cmd run verify:deployment`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
