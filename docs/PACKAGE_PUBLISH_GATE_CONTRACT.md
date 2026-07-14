# Package Publish Gate Contract

Document type: foundation product/data contract  
Status: active scaffold  
Last updated: 2026-07-14

## Purpose

The package publish gate is the admin-facing release-control surface for a white-label Living Textbook package. It prevents a working demo from being mistaken for a pilot-ready or commercially publishable package.

A tenant package may contain reviewed content, games, QR routes, audio, video, playlists, background media, support language, teacher reports, deployment settings, and optional premium features. The publish gate names which of those areas are ready, which require human review, and which block release.

## Current Implementation

Review at:

- `http://127.0.0.1:3000/teacher/intake`

Current files:

- `apps/web/src/data/samplePackagePublishGate.ts`
- `apps/web/src/data/samplePilotEvidencePacket.ts`
- `apps/web/src/data/samplePilotLaunchChecklist.ts`
- `apps/web/src/data/samplePilotReadinessSummary.ts`
- `apps/web/src/features/pilot/PackagePublishGatePanel.tsx`
- `apps/web/src/features/pilot/PilotEvidencePacketPanel.tsx`
- `apps/web/src/features/pilot/PilotLaunchChecklistPanel.tsx`
- `apps/web/src/features/pilot/PilotReadinessSummaryPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`

## Gate Domains

A publish gate item should belong to one of these domains:

- Content
- Media
- Games
- QR
- Reports
- Policy
- Deployment
- Persistence

Each item records:

- status: `ready`, `needs-review`, or `blocked`,
- owner: Codex, tenant, school, or shared,
- whether the item blocks release,
- evidence for the current status,
- the next step,
- what is required before pilot,
- what is not allowed yet.

## Release Rule

Demo-ready is not pilot-publishable.

A package may be shown as a controlled demo while review gates are open. It cannot be marked pilot-publishable while any release-blocking item is blocked or still needs review.

## Publisher Readiness Summary

The `Publisher pilot readiness summary` is a non-technical view derived from the package publish gate. It groups the same source data into:

- demo-ready now,
- pilot blockers,
- missing evidence,
- still-not-allowed promises.

This summary is useful for partner conversations, but it is not a publish action and cannot override the package publish gate. The package publish gate remains the source of truth.

## Pilot Evidence Packet

The `Pilot evidence packet preview` shows what proof must eventually be collected before a partner pilot. It is derived from the package publish gate and package approval ledger.

The evidence packet is metadata-first. It can name required proof, current evidence, blockers, and owners, but it cannot upload files, capture signatures, or approve release in the foundation build.

## Pilot Launch Checklist

The `Pilot launch checklist preview` translates readiness, evidence, and handoff data into staged go/no-go planning.

It can show what is controlled-demo ready, what the publisher must provide, what policy blocks classroom use, and what a teacher dry run must check. It cannot launch students, capture approvals, upload evidence, or mark the package pilot-ready.

## Required Blocking Areas Before Real Pilot

A real pilot package requires closure on:

- reviewed student-facing content,
- target-language audio support for learner text and every assigned game mode,
- media rights and delivery metadata,
- approved unit game offer map,
- package game/audio coverage with unresolved audio gaps closed,
- reviewed activity compatibility snapshots, template rendering profiles, and font accessibility profiles,
- stable QR alias and edition route,
- teacher report/export policy,
- selected deployment profile,
- accepted persistence adapter and durable records,
- pilot package policy for microphone, AI Tutor, assist language, media, reporting, and retention.

## White-Label Rules

- The gate must be tenant-neutral and should not hard-code MiniStar-specific assumptions.
- MiniStar can use the same gate as the flagship tenant.
- A partner package can maintain music, videos, games, and yearly updates through the same release-control pattern.
- Optional AI Tutor or speech scoring must remain tenant-gated and cost-visible.
- Local/closed deployment must stay visible, but must not be promised until backup, update, sync, and offline media procedures are accepted.
- Game/audio coverage is release metadata only; raw audio files stay in media manifests, hosted storage, or local bundles.
- Activity compatibility, template rendering, and font accessibility profiles are release gates before pathway changes, rendered variants, printables, tenant font packs, or extra conversions become student-facing.

## Non-Goals

- This scaffold does not publish real packages.
- This scaffold does not choose a backend.
- This scaffold does not store real student data.
- This scaffold does not grant media rights.
- This scaffold does not turn isolated Z.ai prototypes into integrated games automatically.
- This scaffold does not accept evidence uploads or signed approvals.
- This scaffold does not launch classroom pilots.

## Acceptance Criteria

The gate is useful when a future engineer, agent, teacher, or publisher can answer:

- Is this only a demo, or can it be piloted?
- Which exact issues block pilot release?
- Who owns each issue?
- What must be reviewed before real students use it?
- Which promises are still forbidden?
- What changes when persistence and policy are accepted?
- Can a publisher understand what is demo-ready without mistaking it for pilot approval?
- Can the team explain what remains before a classroom dry run and real pilot launch?
