# Pilot Deployment Configuration Handoff

This is the human-side configuration contract for the first saleable
white-label pilot. It is intentionally separate from the source repository's
code and must be supplied through the deployment secret/configuration system.
Do not commit real values to GitHub or expose them to browser code.

## Required For Every Tenant

Set these values for the exact publisher tenant id:

- `LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN`
- `LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS`
- `LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT`
- `LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN`
- `LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS`
- `LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT`
- `LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT`

Filesystem roots must already exist, be absolute paths, and be owned by the
deployment custody policy. Tenant allowlists are comma-separated exact ids;
wildcards are not supported.

## Closed-Local Or Hybrid Delivery

Also configure:

- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT`
- `LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT`
- `LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED`

The print base URL must be HTTPS in deployment, or localhost/127.0.0.1 for a
controlled local rehearsal. `file:` URLs are never accepted.

## Hosted Persistence

Hosted persistence is optional. If a school opts in, configure the provider
and complete the separate persistence policy, session, retention, backup,
release, and durable-write gates. `process-memory` is a rehearsal provider,
not a saleable durable storage promise.

## Staged Human Gates

The following flags are intentionally separate from configuration presence:

- `LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED`
- `LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED`
- `LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED`
- `LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED`
- `LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED`
- `LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED`
- `LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED`
- `LIVING_TEXTBOOOK_PILOT_DELIVERY_WRITES_ENABLED`
- `LIVING_TEXTBOOOK_PILOT_RELEASE_RECEIPT_WRITES_ENABLED`
- `LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED`
- `LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED` for closed-local or hybrid

Enable these one stage at a time only after the matching evidence and human
decision are complete. The preflight reports their state but never treats an
enabled flag as release approval.

## Verification

Run:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run verify:pilot-deployment-configuration
```

Then inspect [Teacher Deployment](http://127.0.0.1:3000/teacher/deployment).
The operator preflight must show the intended tenant and path as configured,
while writes, QR mutation, persistence activation, and student activation
remain false until the existing human release gates are complete.

