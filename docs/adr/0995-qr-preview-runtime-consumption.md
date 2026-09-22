# ADR 0995: QR Preview Runtime Consumption

## Decision

Use the shared review-only QR alias runtime adapter inside the QR preview route
so visible release and rollback state is evaluated by the same contract that
will govern future route activation.

## Boundary

The preview remains non-mutating. It cannot write redirects, activate routes,
swap packages or media, activate local bundles, or execute rollback.

## Evidence

- `apps/web/src/app/q/[...segments]/page.tsx`
- `scripts/verify-qr-alias-preview-integration.mjs`
