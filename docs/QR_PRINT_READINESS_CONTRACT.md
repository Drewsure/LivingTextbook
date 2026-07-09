# QR Print Readiness Contract

Document type: implementation contract

Status: active scaffold

## Purpose

QR print readiness decides whether a QR code is safe to place in a printed textbook, workbook, classroom card, or long-lived physical material.

Printed QR codes are expensive to repair after publication. Demo routes and draft aliases must not be treated as print-ready.

## Current States

- `print-ready`
- `draft-only`
- `blocked`

## Required Gates

- Stable alias shape.
- Alias persistence.
- Media rights.
- Fallback or legacy message.
- Local fallback when a local/closed deployment is promised.
- Media manifest for audio/video QR targets.

## Required Rules

- Printed QR codes must resolve aliases, not raw files.
- Printed QR codes must not point to local development URLs.
- Printed QR codes must not point to `file://` paths.
- Alias records must be durable before production printing.
- Legacy editions need safe messages or supported package paths.
- Local bundle references must use reviewed manifest ids, not manual folders.

## Acceptance Criteria

- `/teacher/intake` shows QR print readiness after edition alias records.
- Demo and sample publisher QR records are draft-only, not print-ready.
- Direct media-file QR is blocked.
- Media rights and alias persistence blockers are visible.
