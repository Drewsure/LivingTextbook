# ADR 1398: Durable Publisher Intake Preflight Evidence

## Decision

The publisher pilot intake preflight may write a bounded JSON report only when
the operator supplies an explicit output path. The write uses create-once
semantics and refuses to overwrite an existing report.

## Reason

The first saleable white-label pilot needs a durable handoff between a
publisher's supplied folder and the later quarantine/source-review workflow.
Terminal output is easy to lose and cannot be reconciled reliably with later
review records. The report preserves the inventory result without turning a
complete folder into an approved package.

## Boundary

The report contains counts, paths as declared by the publisher, checksums and
gate outcomes. It contains no credentials, learner records, raw payload bytes,
download URLs, package promotion, QR mutation, persistence activation, or
student-facing release decision. Rights, accessibility, package, release, and
school-policy review remain independent gates.

## Verification

- `node scripts/publisher-pilot-intake-preflight.mjs --self-test`
- `node scripts/verify-publisher-pilot-intake-kit.mjs`
- `npm run verify:pilot-package-execution-runbook`

