# White-Label Release Readiness Standard

Status: active foundation standard

## Purpose

Every publisher tenant needs one honest view of what is ready, what is still
review-only, and what blocks production approval. This surface is a control
and evidence view, not a release button.

## Required phases

The readiness record must reconcile these phases:

1. Foundation hardening.
2. Canonical game integration.
3. Controlled pilot.
4. Publisher content pipeline.
5. Production persistence and deployment.
6. Accessibility and localization.
7. Optional AI services.
8. Release readiness.

Each phase must carry a status, evidence records, blockers, and one next
owner action. A missing or blocked phase keeps the overall record blocked.
Review-only phases prevent a false impression that a demo or scaffold is a
production capability.

## Quality signals

The record must keep typecheck, production build, active routes, runtime,
browser, privacy, and tenant-isolation evidence separate from approval. A
green signal means that evidence was observed; it does not authorize data
collection, provider activation, package promotion, or student launch.

## White-label boundary

The record is tenant- and package-bound. MiniStar may be the flagship tenant,
but no MiniStar character, curriculum, asset, language, or reward rule may be
assumed by the platform contract. Publisher branding, content, media, script
policy, storage posture, and optional AI entitlements remain configurable.

## Hard blocks

Until the release owner explicitly accepts the required evidence and policy,
the foundation must keep these actions disabled:

- production approval;
- student production launch;
- real learner data collection;
- provider activation;
- package promotion;
- QR redirect mutation;
- public community publishing.

The dashboard must not create a write path, upload path, provider selection,
assignment, route mutation, or student-facing entitlement as a side effect.

## Package evidence binding

The readiness record must bind to the selected package-readiness reconciliation
through tenant, package, reconciliation, and source-checksum identity. It must
show total lanes, ready-preview lanes, unresolved lane count, and unresolved
lane IDs. Summary phase labels cannot override an unresolved package lane.

Promotion and student-facing activation remain false even when all current
quality signals are green.

The overall readiness status may not become `pilot-ready` while the bound
package evidence contains unresolved lanes. Lane totals must reconcile exactly;
an under-counted or over-counted summary is invalid.

The controlled-pilot phase must also bind to the tenant/package pilot review
decision, including its handoff routes, evidence bindings, blocker count, and
launch/data/report permissions. A demo-ready package is not a live pilot.

## Verification

Run `node scripts/verify-white-label-release-readiness.mjs`,
`node scripts/verify-white-label-release-readiness-behavior.mjs`, the
standards integrity check, web typecheck, production build, foundation
composition, and active-route verification. The route is:
`http://127.0.0.1:3000/teacher/release-readiness`.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-1030 and
`docs/adr/0958-white-label-release-readiness.md`.

The package evidence binding is recorded in `docs/DECISION_REGISTER.md`
DR-1031 and `docs/adr/0959-white-label-package-evidence-reconciliation.md`.

The controlled-pilot binding is recorded in `docs/DECISION_REGISTER.md`
DR-1032 and `docs/adr/0960-white-label-controlled-pilot-decision-binding.md`.
