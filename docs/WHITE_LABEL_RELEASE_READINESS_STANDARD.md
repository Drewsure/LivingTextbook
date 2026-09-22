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

Each quality signal must have one unique source-backed evidence record with an
ISO observation timestamp and notes. The evidence value must agree with the
signal value; a boolean without provenance is not sufficient for release
readiness.

Each quality evidence record must also carry the same tenant and package
identities as the parent readiness record. A green check from another tenant or
package is invalid, even when its source record and timestamp are otherwise
well-formed. The release-readiness workbench must display those evidence
identities beside the quality checks so an adult reviewer can inspect scope
without relying on hidden validation.

These identity and display rules remain evidence-only. They do not authorize
production approval, persistence activation, package promotion, or student
launch.

The same visible scope rule applies to nested package, pilot, and release-
control evidence. Each card must expose the tenant and package identity of the
record it summarizes; headings such as "same tenant package" are not evidence
on their own.

Pilot evidence bindings must be non-empty, string-valued, and unique. The
validator must reject duplicate or malformed identifiers rather than silently
discarding them.

The canonical pilot review decision validator and its provider-neutral snapshot
boundary must enforce the same rule before a decision is accepted for review
storage or rehearsal.

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

Quality evidence records are recorded in `docs/DECISION_REGISTER.md` DR-1033
and `docs/adr/0961-white-label-quality-evidence-records.md`.

Release-control evidence is recorded as a typed join of the package publish
gate, approval ledger, release candidate, open gate count, and open approval
count. It must bind to the same package as the readiness record and expose at
least two source records. Promotion and student-facing activation remain
false; a `pilot-ready` control record is invalid while any gate or approval is
open.

This release-control evidence binding is recorded in `docs/DECISION_REGISTER.md`
DR-1034 and `docs/adr/0962-white-label-release-control-evidence.md`.
