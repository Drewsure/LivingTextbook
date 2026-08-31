# DR-537: Two-Tenant Local Companion Preview Routes

Status: Accepted

Decision: Keep review-only local companion preview routes for both MiniStar and the sample publisher tenant.

Reasoning:

- The flagship MiniStar school product and the white-label publisher product both need local companion visibility.
- Sharing the same preview panel keeps the local package model white-label rather than tenant-specific.
- Browser verification can now confirm both local manifest shapes stay route-visible.

Rules:

- `/local/ministar` and `/local/sample-publisher` are preview-only.
- Both routes must use reviewed sample manifests and the shared local companion package preview panel.
- Neither route can export packages, install a local app, claim offline-ready status, store student data, or mutate QR redirects.

Verification:

- `npm run verify:local-bundle`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
