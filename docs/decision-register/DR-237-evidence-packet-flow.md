# DR-237: Evidence Packet Flow

## Decision

Require an evidence packet flow in the upload, Labelled Diagram asset, and media asset workspaces before live upload or asset activation controls are introduced.

## Rationale

The platform needs real upload, image, audio, music, video, and local-bundle workflows eventually, but those workflows must not bypass review, rights, scan policy, target mapping, audio coverage, accessibility, captions, release control, or classroom assignment gates. Evidence packets make the required proof visible before any storage or promotion code exists.

## Implications

- `/teacher/uploads/sample-publisher` now shows `Upload evidence packet flow`.
- `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram` now shows `Labelled Diagram evidence packet flow`.
- `/teacher/assets/media/sample-publisher-l1-u1-routines-media` now shows `Media evidence packet flow`.
- Live upload buttons, upload progress, approve/publish actions, object storage writes, local folder activation, label editing, coordinate editing, media transcoding, playlist creation, and assignment shortcuts remain blocked.

## Next

Only build real upload controls after the relevant `evidence_packet` records have durable storage, identity/audit rules, release-control gates, and hosted/local adapter behavior.
