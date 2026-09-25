# PWA Installability Standard

The Living Textbook platform is intended to become a white-label Progressive Web App. This standard defines the foundation before offline caching, sync, or local companion packaging are implemented.

## Current Foundation

Implemented foundation files:

- `apps/web/src/app/manifest.ts`
- `apps/web/src/app/layout.tsx`
- `apps/web/public/icons/living-textbook-icon.svg`

The current PWA work provides:

- App name and short name
- Standalone display mode
- Start URL and scope
- Theme and background colors
- App categories
- A tenant-neutral icon asset
- Metadata link to the generated manifest route

## Standards

- PWA identity must remain white-label friendly.
- MiniStar branding must not be hard-coded into global app metadata.
- Tenant-specific install names, icons, theme colors, and splash assets should become configurable when tenant deployment packaging is introduced.
- Offline caching, service workers, local storage, background sync, and media bundle caching are deferred until persistence, update, rights, and local deployment policies are settled.
- Any future offline-ready manifest must carry a versioned cache policy with an explicit route allowlist, asset-kind allowlist, learner-data exclusion, and disabled background sync before a service worker can be considered.
- Local/closed companion deployments must define update, backup, export, media-rights, and storage behavior before caching student data or partner media.
- The PWA shell must not hide the difference between a static demo and a live classroom pilot.

## Deferred Work

Do not add these until the related contracts are ready:

- Service worker cache strategy
- Offline progress write queue
- Offline media bundle cache
- Installed-PWA update prompts
- Tenant-specific generated icons
- Local classroom sync
- Push notifications
- Background sync

The shared local-bundle manifest now validates this cache-policy shape in
review-only mode. Validation does not register a service worker, mutate a
browser cache, precache media, or store learner data.

## Verification

See:

- `docs/verification/PWA_INSTALLABILITY_CHECKS.md`
