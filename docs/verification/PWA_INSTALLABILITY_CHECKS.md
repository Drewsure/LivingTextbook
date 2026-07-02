# PWA Installability Verification

Use this checklist after pulling `legacy-source-import` and running local typecheck/build.

## Routes And Files

Open:

- `http://127.0.0.1:3000/manifest.webmanifest`
- `http://127.0.0.1:3000/icons/living-textbook-icon.svg`
- `http://127.0.0.1:3000/`

## Checks

- The manifest route returns a JSON manifest.
- The manifest name is `Living Textbook` and does not hard-code MiniStar as the platform name.
- The manifest uses `standalone` display mode.
- The manifest includes a start URL and scope of `/`.
- The manifest points to `/icons/living-textbook-icon.svg`.
- The icon route loads without a 404.
- The root page metadata links the manifest.
- No service worker, offline cache, or progress sync behavior has been introduced yet.
- Offline/local companion behavior remains documented as deferred until policy, persistence, update, and media-rights decisions are made.

## Acceptance

The app has a clean installability foundation without pretending that offline classroom storage, media caching, or local sync are production-ready.
