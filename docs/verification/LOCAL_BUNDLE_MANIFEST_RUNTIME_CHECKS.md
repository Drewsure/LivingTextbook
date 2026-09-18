# Local Bundle Manifest Runtime Checks

## Purpose

The local/offline bundle manifest is a deployment boundary. Its validator must
reject unsafe local paths, duplicate asset identifiers, and offline-ready claims
without final checksum and rights evidence while allowing an explicit planning
manifest to remain reviewable.

## Required Checks

- Planning manifests can remain structurally valid with visible checksum
  warnings.
- Offline-ready manifests require final `sha256-` checksums and rights evidence.
- Windows paths, absolute paths, and traversal segments are rejected.
- Asset identifiers and local paths are unique within a manifest.
- QR fallback paths are application-relative and do not contain filesystem
  paths.
- The read-only resolver returns only manifest-declared routes and assets.
- A resolver created for one tenant returns no route or asset for another
  tenant, and unknown identifiers do not produce guessed paths.
- The local companion preview must exercise that resolver and show route/asset
  resolution evidence for the tenant being previewed.
- Validation is pure and does not write files, register service workers, copy
  media, or activate offline storage.

## Verification

```text
node scripts/verify-local-bundle-manifest-runtime.mjs
node scripts/verify-local-bundle-resolver-runtime.mjs
npm run verify:local-bundle
npm run verify:foundation
```

The validator and resolver are shared content-model contracts. The local
companion preview exercises them in read-only rehearsal mode, but they do not
approve rights, read directories, create a bundle, or mark the current sample
package offline-ready.
