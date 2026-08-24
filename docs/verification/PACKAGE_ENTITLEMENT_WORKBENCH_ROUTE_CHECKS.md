# Package Entitlement Workbench Route Checks

## Scope

Run after changes to AI generation, AI Tutor, Voice Tutor, microphone scoring, speech matching, report export, hosted storage, local companion mode, or package pricing/entitlement copy.

## Route

- `http://127.0.0.1:3000/teacher/entitlements`

## Required Page Signals

- The route is labeled `Package entitlement workbench`.
- The route states `Optional paid features, cost gates, and tenant controls`.
- The route shows `Review-only`.
- The route shows `No live model billing`.
- The route shows `No child-facing upsell`.
- The route shows `No package activation`.
- The route separates `Core classroom package`, `Premium AI generation`, `Voice Tutor and speech scoring`, and `Hosted storage and local companion`.
- The route shows `No premium upsell shown to children`.
- The route shows `No speech API billing`.
- The route shows `White-label package catalog`.
- The route shows `Base platform first, optional packages second`.
- The route separates `Core classroom PWA`, `Premium AI authoring`, `Premium Voice Tutor`, and `Enterprise storage and local companion`.
- The route shows `Included capabilities`, `Adoption requirements`, `Cost controls`, and `Child safety rules`.
- The route shows `Package adoption readiness`.
- The route shows `School and tenant approval before premium activation`.
- The route shows `Required approvals`, `Required records`, `Cost review`, `Policy review`, and `Blocked actions`.
- The route shows `School AI usage policy approval`, `Microphone policy acceptance`, and `School privacy and retention approval`.
- The route shows `Future package adoption record preview`.
- The route shows `Minimum accepted-record fields before premium enablement`.
- The route shows `Minimum fields`, `Required evidence`, `Acceptance scopes`, `Blocked writes`, and `Rollback hooks`.
- The route shows `No accepted premium AI adoption record`, `No accepted Voice Tutor adoption record`, and `No accepted enterprise adoption record`.
- The route shows `No microphone permission prompt`.
- The route shows `No raw audio storage` and `No transcript storage`.
- The route shows `No report export from this route`, `No object storage write`, `No local folder write`, and `No release-state mutation`.
- The route renders the `AI generator cost and entitlement gate`.
- The route renders the `Voice Tutor` package panel for tenant package review.

## Automated Verification

Run:

```powershell
npm run verify:package-entitlements
npm run verify:routes
```

The active route verifier must expect 82 active routes.
