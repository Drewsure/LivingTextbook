# ADR 1093: Local Bundle Resolution Delivery Status

## Status

Accepted.

## Decision

Every read-only local bundle route and asset resolution must carry an explicit
delivery status. A planning manifest produces `planning`; only a manifest that
passes the offline-ready validator may produce `offline-ready`.

The status is evidence about the manifest contract only. It does not grant
file access, activate offline mode, register a service worker, write a bundle,
or store learner data.

## Rationale

The resolver already prevents path guessing and cross-tenant lookups, but a
plain "resolved" result can be misread as playable local delivery. White-label
partners need to distinguish a reviewed rehearsal from a distributable closed
companion package before a loader or installer exists.

## Guardrails

- Planning manifests remain resolvable only for rehearsal and are labeled
  `planning`.
- `offline-ready` is derived only after the shared manifest validator passes.
- The resolver remains read-only and provider-neutral.
- No browser cache, local file, learner record, QR redirect, or package is
  created by this status.

See `packages/content-model/src/localBundleRuntime.ts` and
`docs/verification/LOCAL_BUNDLE_MANIFEST_RUNTIME_CHECKS.md`.
