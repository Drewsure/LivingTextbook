# Living Textbook Verification Index

Use `docs/VERIFICATION_CHECKLIST.md` as the primary local verification path after the `legacy-source-import` branch is synced and the app is running.

Focused verification supplements:

- `docs/verification/AI_TUTOR_ENTITLEMENT_CHECKS.md`
- `docs/verification/MEDIA_TELEMETRY_CHECKS.md`

## Current Hard Gate

Local verification is still blocked until the local checkout is synchronized to `legacy-source-import`.

Required local setup:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT"
Rename-Item "LivingTextbook" "LivingTextbook-local-main-backup"
git clone --branch legacy-source-import https://github.com/Drewsure/LivingTextbook.git LivingTextbook
```

Then run build/typecheck and verify:

- `/`
- `/teacher`
- `/launch/demo-unit-1`
- `/enter/ministar`

Do not mark connector-side changes as locally verified until this is complete.
