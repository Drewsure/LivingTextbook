# Pilot Handoff Package Contract

The pilot handoff package is the admin-facing bridge between a static demo and a real partner pilot. It does not create production persistence, accounts, or exports. It names what can be shown, what exists as sample data, what the partner must provide, and what decisions must be closed before real student data is stored.

## Purpose

- Keep white-label pilot scope realistic.
- Prevent a demo route from being mistaken for a production product.
- Show the routes, assets, decisions, and human inputs needed for a partner pilot.
- Keep cost control visible by recommending hosted PWA first while preserving local/closed deployment compatibility.

## Current Implementation

- Sample data: `apps/web/src/data/samplePilotHandoffPackage.ts`
- Panel: `apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`
- Route: `/teacher/intake`

## Required Sections

A handoff package should include:

- tenant id and package id,
- recommended pilot window,
- recommended deployment path,
- student and teacher routes to show,
- content, media, game, and report assets,
- owner for each open item,
- human decisions before pilot,
- cost impact for major decisions,
- notes on what not to overpromise.

## Product Rules

- Do not promise full commercial readiness from the handoff panel.
- Do not promise automatic PDF conversion until reviewed intake exists.
- Do not promise durable reports until persistence, privacy, retention, and export policy are accepted.
- Do not promise local/offline packaging until backup, update, export, and local route behavior are designed.
- AI Tutor remains optional and premium-gated, not part of the core pilot promise.

## Acceptance Criteria

A partner pilot handoff is credible when:

- at least one tenant-branded route is working,
- front-door entry and direct launch routes are available,
- one teacher session monitor route exists,
- the first content package is reviewed,
- audio/video rights and file delivery are known,
- two to four game modes are selected for pilot quality,
- persistence and policy blockers are explicitly named.
