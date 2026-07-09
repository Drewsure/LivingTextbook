# ADR 0057: Local Deployment Preflight Before Closed Companion Build

Date: 2026-07-09

Status: accepted

## Context

The platform needs a local/closed deployment strategy for textbook partners, but building it too early could consume time before hosted pilot assumptions are validated.

## Decision

Add a local deployment preflight gate to `/teacher/intake`.

## Implications

The local companion path remains visible and saleable, while its blockers are clear:

- bundle manifest,
- media bundle,
- installer/update,
- local reporting,
- QR/deep-link behavior,
- offline access control.
