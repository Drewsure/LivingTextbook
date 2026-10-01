# ADR 1370: QR Payload Alias Integrity

## Status

Accepted for the v1 local pilot QR artifact contract.

## Context

The local package QR manifest already carried an encoded URL, alias path,
fallback path, and SVG checksum. The runtime validator checked each field's
shape, but a payload could still point at a different valid route while
retaining a valid-looking URL and checksum metadata.

## Decision

Require the shared QR print entry contract to include the complete embedded SVG
and validate that `encodedUrl` is exactly `baseUrl + aliasPath`. The local
package runtime rejects either a missing/incomplete SVG or a URL/alias mismatch
before serving print evidence.

## Consequences

- A printed QR entry cannot silently drift to another route while remaining
  structurally valid.
- The machine-readable artifact contains enough payload evidence to audit the
  generated symbol without regenerating it.
- Package-local fallbacks remain independently validated and are not derived
  from a hosted URL.

## Verification

- `node scripts/verify-local-pilot-package-assembler-behavior.mjs`
- `npm run verify:foundation-composition`

