# DR-240: Evidence Packet Handoff Preview Route

## Decision

Create a review-only evidence packet handoff preview route at `/teacher/evidence/sample-publisher/handoff`.

## Rationale

Evidence packets need a clear handoff shape before live export or signature workflows exist. The route lets a teacher/admin reviewer see what would be packaged for a publisher, school, or platform operator while preserving all safety gates.

## Implications

- Upload intake, Labelled Diagram, and media evidence sections are visible together.
- Recipient responsibilities are explicit for publisher reviewer, school approver, and platform operator.
- Export, signed approval capture, publish, upload promotion, route creation, playlist creation, and assignment from evidence remain blocked.
- The partner demo, active route list, active route verifier, and upload-channel verifier include this route.

## Next

Do not implement live evidence export, signature capture, or release-state mutation until reviewer identity, evidence attachment storage, retention/export policy, and release-control state machines are accepted.
