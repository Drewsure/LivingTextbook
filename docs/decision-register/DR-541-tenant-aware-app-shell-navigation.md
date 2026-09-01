# DR-541: Tenant-Aware App Shell Navigation

Status: Accepted

Decision: Build shared app-shell navigation from the current tenant and keep partner-only workbench links off MiniStar-branded pages.

Rationale:

- Navigation is part of the white-label boundary, not only a convenience layer.
- MiniStar pages should not lead teachers into sample-publisher uploads, evidence, release-control, asset, local package, or partner session surfaces.
- Route helpers reduce future hard-coded URL drift as more tenant routes are added.

Guardrails:

- MiniStar shell navigation uses MiniStar source, generator, prototype, review, media, session, and local preview links.
- Sample publisher shell navigation can keep the deeper partner pilot workbenches that currently only exist for that tenant.
- Navigation links remain review shortcuts only and cannot activate uploads, storage, release, local export, scoring, rewards, assignments, or classroom launch.
- Active route verification must protect representative positive and forbidden tenant navigation markers.

Verification:

- `npm.cmd run verify:upload-channels`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
