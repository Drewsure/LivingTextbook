# Pilot Package Execution Runbook

Status: controlled operator procedure for the first white-label pilot

This runbook is the final local-delivery bridge after a publisher submission has
passed source review, package evidence review, delivery review, QR review,
teacher policy review, and manual release approval. It does not replace those
decisions and it does not activate hosted persistence or student access by
itself.

## Operating Boundary

- Use the procedure only for a tenant-scoped `closed-local` or `hybrid` package.
- Keep the operator token in a server-side environment variable. Never put it
  in a request JSON file, browser field, QR code, or learner-visible route.
- Run preflight first. Preflight must return `ready-for-assembly` before the
  write command is considered.
- Assembly copies only approved publisher assets into the configured package
  root and performs staged read-back verification.
- The assembled package contains no learner records and does not mutate QR
  aliases, activate hosted persistence, or create an assignment.
- Hosted persistence remains a separate opt-in deployment decision.

## Required Environment

Set these values in the operator's local PowerShell session, using paths that
are outside the source repository when possible:

```powershell
$env:LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN = "<tenant-scoped-secret>"
$env:LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS = "<tenant-id>"
$env:LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT = "D:\LivingTextbookPackages"
$env:LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT = "D:\LivingTextbookApprovedAssets"
$env:LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED = "true"
$env:LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL = "https://<approved-tenant-host>"
```

The quarantine root, review gates, and approved-asset promotion custody must
already be provisioned according to `docs/OPERATING_NOTES.md`. Do not invent a
path or use a placeholder folder for an actual package run.

Before quarantine intake, preserve the publisher's completed inventory as a
new evidence file using `scripts/publisher-pilot-intake-preflight.mjs --output`.
The helper uses create-once semantics and must not replace an earlier report.

## Procedure

1. Confirm the live handoff shows the exact tenant, quarantine, package,
   version, source checksum, publisher evidence request IDs, canonical game
   evidence IDs, release receipt, and QR print authorization.
2. Create a non-overwriting request draft from those exact identifiers:

```powershell
node scripts/create-local-package-request-draft.mjs `
  --output "D:\LivingTextbookOperator\requests\<package-id>.json" `
  --tenant "<tenant-id>" `
  --package "<package-id>" `
  --version "<version>" `
  --quarantine "<quarantine-id>" `
  --review-packet "<review-packet-id>" `
  --bundle-review-id "<bundle-manifest-review-id>" `
  --operator "<operator-id>"
```

3. Run the read-only preflight. A non-zero result is a stop condition:

```powershell
node scripts/run-local-package-operator.mjs `
  --request "D:\LivingTextbookOperator\requests\<package-id>.json" `
  --preflight
```

4. Inspect the bounded output. It must show `ready-for-assembly`, the expected
   source file count, and no custody, evidence, release, path, or policy
   errors. Do not proceed from a merely reachable endpoint.
5. Reconfirm the operator and school release decision immediately before the
   write. Then set the one-shot confirmation and assemble:

```powershell
$env:LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION = "ASSEMBLE_LOCAL_PACKAGE"
node scripts/run-local-package-operator.mjs `
  --request "D:\LivingTextbookOperator\requests\<package-id>.json" `
  --assemble
Remove-Item Env:LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION
```

6. Accept only `status: "accepted"` or a clearly reported idempotent retry.
Record the returned relative directory and verify the generated
`metadata/package-integrity.json`, `metadata/qr-print-sheet.html`, and
`metadata/assembly-record.json` before handing the package to the publisher.
7. Open the package's local front door using the declared fallback path and
   rehearse Flashcards, the curated next game, audio controls, QR identity, and
   teacher evidence view. Use synthetic or approved pilot identities only.
8. Preserve the package checksum and operator output with the pilot handoff.
   Never email the bearer token or the quarantine payload.

## Failure And Recovery

If preflight is blocked, fix the named evidence or custody record and rerun
preflight. Do not force the writer. If assembly returns a conflict, preserve
the existing package and reconcile its integrity record; do not delete or
overwrite it. If the package fails read-back, stop distribution and use the
existing recovery/rollback review procedure.

This procedure is intentionally not a browser release button. A future
production operator console may wrap it after tenant authentication, audit,
and school-policy review are complete.
