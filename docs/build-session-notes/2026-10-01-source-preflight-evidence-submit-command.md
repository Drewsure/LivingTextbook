# Build Session: Guarded Source Preflight Evidence Submission

Added the operator command that submits the create-once source preflight
evidence request to the tenant-bound review endpoint.

- Requires the server-side quarantine credential.
- Validates bounded tenant, quarantine, and package identities.
- Sends only the review report and lineage fields; raw publisher files are
  never uploaded by this command.
- Refuses non-review-only or protected-action-enabled requests.
- Reports idempotence and evidence identity without exposing credentials.

This advances the real publisher handoff but remains evidence capture, not
package approval, release, QR authorization, persistence activation, or student
launch.
