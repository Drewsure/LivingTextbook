# Package Publish Gate Contract

Document type: foundation product/data contract  
Status: active scaffold  
Last updated: 2026-07-16

## Purpose

The package publish gate is the admin-facing release-control surface for a white-label Living Textbook package. It prevents a working demo from being mistaken for a pilot-ready or commercially publishable package.

A tenant package may contain reviewed content, games, QR routes, audio, video, playlists, background media, support language, teacher reports, deployment settings, and optional premium features. The publish gate names which of those areas are ready, which require human review, and which block release.

## Current Implementation

Review at:

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`
- `http://127.0.0.1:3000/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet`

Current files:

- `apps/web/src/data/samplePackagePublishGate.ts`
- `apps/web/src/data/samplePilotEvidencePacket.ts`
- `apps/web/src/data/samplePilotLaunchChecklist.ts`
- `apps/web/src/data/samplePilotReadinessSummary.ts`
- `apps/web/src/data/sampleTeacherDryRunRehearsal.ts`
- `apps/web/src/data/sampleClassroomLaunchGate.ts`
- `apps/web/src/data/sampleSchoolLaunchPolicyGate.ts`
- `apps/web/src/data/sampleSchoolPolicyHandoffPacket.ts`
- `apps/web/src/data/sampleSchoolPolicyAcceptancePreflight.ts`
- `apps/web/src/features/pilot/PackagePublishGatePanel.tsx`
- `apps/web/src/features/pilot/PilotEvidencePacketPanel.tsx`
- `apps/web/src/features/pilot/PilotLaunchChecklistPanel.tsx`
- `apps/web/src/features/pilot/PilotReadinessSummaryPanel.tsx`
- `apps/web/src/features/pilot/TeacherDryRunRehearsalPanel.tsx`
- `apps/web/src/features/pilot/ClassroomLaunchGatePanel.tsx`
- `apps/web/src/features/pilot/SchoolLaunchPolicyGatePanel.tsx`
- `apps/web/src/features/pilot/SchoolPolicyHandoffPacketPanel.tsx`
- `apps/web/src/features/pilot/SchoolPolicyAcceptancePreflightPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`
- `apps/web/src/app/teacher/policy-handoff/[packetId]/page.tsx`

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

## Teacher Dry-Run Rehearsal

The `Teacher dry-run rehearsal preview` turns the pilot launch checklist into a concrete teacher-only script before children use the package.

It can rehearse entry codes, QR/front-door routes, flashcards, target-language unlocks, game audio, support-language limits, media playlists, teacher reports, and local fallback expectations. It is dry-run evidence only: it cannot collect real learner data, store live progress, export reports, upload evidence, or approve a classroom pilot.

## Classroom Launch Gate

The `Classroom launch gate preview` is the final foundation boundary between teacher rehearsal and real student use.

It is derived from the package publish gate, approval ledger, pilot evidence packet, and teacher dry-run rehearsal. It shows `Launch blocked`, `No live student session`, `No launch button`, `Real learner data blocked`, and `Report export still blocked` until release, policy, evidence, dry-run, and persistence obligations are closed.

This gate is not a launch workflow. It cannot invite students, create a live class, store learner records, export reports, or approve a pilot.

The backend-neutral record is `classroom_launch_gate` / `classroom-launch-gate`. Hosted and local implementations must preserve source gate references, required-before-launch items, launch-blocked status, policy blockers, persistence blockers, real-learner-data blocks, and report-export blocks before any live classroom launch workflow exists.

The focused route is a review workspace only. It may link to source routes for evidence review, but it must not create assignments, expose a launch button, or change package status.

## School Launch Policy Gate

The `School launch policy gate preview` separates a partner demo from a school-approved classroom launch.

It is derived from pilot policy readiness, the classroom launch gate, and the teacher dry-run rehearsal. It names the ownership lanes that must close before live classroom use:

- school privacy and retention acceptance,
- classroom operating mode acceptance,
- publisher media and local package acceptance,
- teacher dry-run evidence acceptance,
- platform release and storage acceptance.

This gate is a review packet only. It cannot accept school policy, approve a launch, create a live student session, collect real learner data, export reports, activate local deployment, mutate release state, or mark a package launch-ready.

This distinction is a white-label product rule: a tenant can have a strong controlled demo while school-owned privacy, retention, reporting, access-control, support-language, microphone, AI Tutor, media, local deployment, and storage decisions remain open.

The backend-neutral record is `school_launch_policy_gate` / `school-launch-policy-gate`. Hosted and local implementations must preserve school, publisher, platform, and shared dry-run ownership while blocking policy acceptance workflows, live launch, real learner data, report export, local activation, release-state mutation, launch-ready status, and support-language-only progression.

## School Policy Handoff Packet

The `School policy handoff packet preview` translates the school launch policy gate into a school-facing discussion guide.

It is derived from the school launch policy gate and organizes a future school meeting around:

- privacy, retention, and learner data,
- teacher-led QR and student progression rules,
- publisher media, music, video, and local package responsibilities,
- teacher dry-run and evidence packet expectations,
- platform storage, release, and rollback controls.

This packet is a handoff draft only. It can name evidence needed, deferred decisions, and blocked actions, but it cannot accept policy, capture signatures, create launch-ready status, export evidence, mutate release state, activate local deployment, create production QR promises, or start a live classroom workflow.

The packet is part of the white-label foundation because schools and publishers need a readable pre-sales and pilot-readiness artifact. It must remain tenant-neutral and must not hard-code MiniStar-only mascots, curriculum, or school language.

The backend-neutral record is `school_policy_handoff_packet` / `school-policy-handoff-packet`. Hosted and local implementations must preserve packet sections, evidence needs, deferred decisions, blocked actions, and discussion-only status while blocking policy acceptance, signed approval capture, evidence export, release-state mutation, launch-ready status, local activation, production QR promises, learner data, report export, and live classroom workflow.

The focused route is a meeting packet preview only. It may link back to source evidence routes, but it must not create assignments, accept policy, capture signatures, export evidence, activate local deployment, create production QR promises, or change package status.

## School Policy Acceptance Preflight

The `School policy acceptance preflight` is the hard boundary before any future school acceptance workflow exists.

It is derived from the school policy handoff packet and reviewer identity/signature gate. It names the lanes that must be closed before an eventual school acceptance action can be designed:

- authenticated school approver,
- policy text and scope,
- evidence packet and attachment readiness,
- release-control binding,
- child safety and progression boundaries,
- hosted, local, and rollback readiness.

This preflight is review-only. It can show missing requirements, blocked actions, minimum acceptance record fields, and operating rules, but it cannot accept policy, collect a signature, export evidence, activate storage, create launch-ready status, create production QR promises, invite students, collect real learner data, export reports, or mutate release state.

The preflight protects the white-label product by ensuring a school acceptance is never a vague meeting note. Future implementations must tie acceptance to a known school approver, tenant, school, release candidate, handoff packet version, policy text version, storage policy, learner-data rules, support-language rules, microphone/AI Tutor opt-ins, and rollback/revocation plan.

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
- This scaffold does not collect real learner data during teacher dry runs.
- This scaffold does not expose a live classroom launch button.

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
- Can a teacher rehearse routes, games, audio, media, support-language limits, reporting, and local fallback without triggering live student workflows?
- Can the team see the final launch boundary before real children, real learner records, or report exports are enabled?
- Can the team clearly distinguish a partner demo from a school-approved launch, including which obligations belong to the school, publisher, platform, and shared teacher dry-run process?
- Can a school meeting use the handoff packet to discuss privacy, QR use, progression rules, media, dry-run evidence, storage, release, and rollback without triggering acceptance, launch, or export workflows?
- Can the team see exactly what remains before a future school policy acceptance button, signature capture, evidence export, storage activation, production QR promise, AI Tutor activation, or live classroom workflow can exist?
