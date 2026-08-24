# Package Entitlement Verifier Checks

## Scope

Use this checklist after changes to white-label package tiers, AI generation entitlement copy, AI Tutor, Voice Tutor, microphone scoring, speech API policy, hosted storage, report export, local companion mode, or the `/teacher/entitlements` route.

## Command

```powershell
npm run verify:package-entitlements
```

## Required Checks

- The verifier checks the package catalog has `core-classroom-pwa`, `premium-ai-authoring`, `premium-voice-tutor`, and `enterprise-storage-and-local`.
- The verifier checks the route renders `PackageTierCatalogPanel`, `AiGeneratorCostEntitlementGatePanel`, and `VoiceTutorPackagePanel`.
- The verifier checks the route renders `PackageAdoptionReadinessPanel`.
- The verifier checks four adoption reviews for core classroom, premium AI authoring, premium Voice Tutor, and enterprise storage/local companion.
- The verifier checks three future adoption record previews for premium AI authoring, premium Voice Tutor, and enterprise storage/local companion.
- The verifier checks minimum fields, required evidence, acceptance scopes, blocked writes, and rollback hooks before premium enablement.
- The verifier checks the backend storage verifier and active route verifier preserve package adoption storage terms before accepted adoption records, billing writes, model calls, microphone scoring, report exports, hosted storage activation, or local companion activation.
- The verifier checks the entitlement route renders a review-only package adoption storage guard with storage contracts, visible fields, required pre-activation decisions, and blocked activation evidence.
- The verifier checks the active route verifier expects the package catalog and package boundary text.
- The verifier checks MiniStar and sample publisher keep AI Tutor and AI speech scoring disabled by default.
- The verifier checks no live upload input, microphone request, or live fetch call is introduced on the entitlement route.
- The verifier checks the ADR, decision-register record, route checklist, active route list, and route contract remain present.

## Foundation Rule

`npm run verify:foundation` must include `npm run verify:package-entitlements` before the generic review-key and route checks.
