# Package Approval Ledger Contract

Document type: foundation product/data contract  
Status: active scaffold  
Last updated: 2026-07-09

## Purpose

The package approval ledger is the backend-agnostic sign-off record that sits behind the package publish gate.

The publish gate answers whether a package is ready. The approval ledger answers who approved each release area, what evidence supports the approval, and which blockers still prevent approval.

## Current Implementation

Review at:

- `http://127.0.0.1:3000/teacher/intake`

Current files:

- `apps/web/src/data/samplePackageApprovalLedger.ts`
- `apps/web/src/features/pilot/PackageApprovalLedgerPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`

## Required Sign-Off Areas

A pilot-ready package requires explicit sign-off for:

- content review,
- media rights,
- game quality,
- QR and route stability,
- privacy, reports, and retention,
- deployment and support,
- platform release review.

## Ledger Shape

Each sign-off records:

- sign-off id,
- label,
- approval role,
- status: `signed`, `needs-signoff`, or `blocked`,
- owner,
- whether it is required before pilot,
- evidence,
- next step,
- conditions that prevent approval.

## Release Rule

A release candidate can be approved only when every required sign-off is signed and no required sign-off is blocked by media rights, report policy, QR stability, deployment, or persistence gaps.

## Future Persistence Requirements

When a backend is selected, each sign-off should persist:

- tenant id,
- package id,
- release candidate,
- package version,
- approver identity,
- approver role,
- timestamp,
- evidence links,
- notes,
- replacement or rollback relationship.

## White-Label Rules

- MiniStar and partner packages use the same ledger shape.
- Tenant-specific owners are allowed; tenant-specific schema forks are not.
- A signed item cannot override safety, policy, media-rights, or persistence blockers.
- Optional premium features such as AI Tutor and speech scoring require their own explicit sign-off before activation.

## Non-Goals

- This scaffold does not create real approvals.
- This scaffold does not authenticate approvers.
- This scaffold does not select a backend.
- This scaffold does not replace policy review.
- This scaffold does not publish packages automatically.
