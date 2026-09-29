# Operating Note: TypeScript Extension Normalization in CommonJS Harnesses

## Symptom

The production content-model source intentionally uses an explicit `.ts`
extension for the direct Node strip-types verifier. A separate TypeScript to
CommonJS verification harness may then fail with `Cannot find module
"./...ts"` because the compiled sibling is `.js`.

## Required workaround

After the harness compiles the source tree into its temporary output directory,
rewrite only the emitted sibling import from `.ts` to `.js` before requiring the
compiled module. Keep this normalization inside the verifier; do not change the
production source solely to satisfy a temporary CommonJS harness.

The current example is `scripts/verify-ai-service-runtime.mjs`, which
normalizes the compiled `pilotDeliveryReleaseReceipt.js` import of
`pilotDeliveryManifest.ts`. The text/spelling runtime verifier follows the same
pattern.

## Verification

Run:

```powershell
npm run verify:ai-service
npm run verify:text-spelling-engine-runtime
```

This is a test-harness compatibility procedure only. It must not alter source
files, package output, or runtime import policy.
