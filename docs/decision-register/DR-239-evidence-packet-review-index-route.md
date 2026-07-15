# DR-239: Evidence Packet Review Index Route

## Decision

Create a tenant-scoped evidence packet review index route at `/teacher/evidence/sample-publisher`.

## Rationale

Evidence readiness is spread across upload intake, Labelled Diagram image assets, and media assets. A single review index gives teachers, admins, and future agents a safer command center before live file upload, approval, publishing, route creation, playlist creation, or student assignment features exist.

## Implications

- The route shows upload, Labelled Diagram, and media evidence sources.
- The route lists storage records including `evidence_packet`, upload review records, `game_asset_manifest`, `label_anchor_record`, media bindings, and release-control packets.
- The route repeats hard blocks for live evidence upload, signed approval capture, approve/publish actions, playlist creation from uploaded media, local activation, and student-facing use from evidence packets alone.
- Active route and upload-channel readiness verifiers must include this route.

## Next

Keep this route review-only until authentication, evidence storage, signed approval policy, release-control state changes, and assignment safety gates are implemented and verified.
