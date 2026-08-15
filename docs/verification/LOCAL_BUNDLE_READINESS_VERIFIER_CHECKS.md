# Local Bundle Readiness Verifier Checks

## Scope

Run after local companion package, local bundle manifest, local deployment preflight, local release gate, media bundle, QR fallback, report export, or installer/update changes.

## Checks

- Confirm `npm run verify:local-bundle` passes.
- Confirm MiniStar and sample publisher bundle manifests remain represented.
- Confirm local game routes include flashcards, Match Up, Label It, Memory Match, Quiz, True or False, Type Answer, Sentence Builder, and Speak It.
- Confirm local package artifacts include content package, QR registry, game routes, report policy, release gate, installer, and checksum requirements.
- Confirm unknown media rights or missing checksums prevent offline-ready status.
- Confirm blocked deployment preflight checks prevent offline-ready status.
- Confirm the local preview route remains in the active route list.
- Confirm AI Tutor remains off by default for local bundles.

## Verification Command

```powershell
npm run verify:foundation
```
