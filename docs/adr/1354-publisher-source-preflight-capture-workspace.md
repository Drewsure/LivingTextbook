# ADR 1354: Publisher Source Preflight Capture Workspace

Date: 2026-10-01
Status: Accepted

## Decision

Expose a tenant-scoped teacher workspace control for selecting the JSON report
created by the local publisher source preflight and submitting it to the
source-preflight evidence route. The control previews only bounded report
identity and count fields before submission.

## Rationale

The pilot needs an operator-shaped path from a publisher's local source
folder to the quarantine evidence chain. Requiring a command-line POST would
leave a gap between the preflight artifact and the teacher review journey.
The workspace closes that usability gap without turning the source report into
a payload upload or a release action.

## Boundaries

The server gate remains disabled by default. The control accepts JSON evidence
only, does not upload textbook or multimedia bytes, and cannot approve,
assemble, promote, print QR codes, activate hosted persistence, create learner
records, or start students.
