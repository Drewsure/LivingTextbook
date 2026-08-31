# DR-538: Persistence Storage Selection Gate Visibility

Status: Accepted

Decision: The focused persistence workbench must show the shared evidence storage adapter selection gate.

Rationale:

- Backend decisions should be visible where storage, schema, migration, boundaries, and adapter readiness are reviewed.
- Hosted managed evidence storage remains the recommended first pilot path for cost control and faster validation.
- Closed local storage remains important for white-label textbook companions, but it carries installer, backup, restore, encryption, and update obligations.

Guardrails:

- The panel is review-only and cannot select a backend vendor.
- No uploads, object buckets, signed URLs, local folders, evidence downloads, report exports, local companion activations, or release-state mutations become live.
- Persistence route verification must check the storage adapter selection text.
- Repeated review-list text uses contextual keys.

Verification:

- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
