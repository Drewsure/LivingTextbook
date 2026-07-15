# ADR 0231: Disabled Upload Intake Controls

## Status

Accepted.

## Context

The teacher upload workspace needs to show the future upload interaction shape without enabling live file selection. A visible disabled control preview helps product planning, but a real file input would imply storage, scan policy, and upload records are already available.

## Decision

Add disabled upload intake controls to `/teacher/uploads/sample-publisher`. The preview shows selected file state, source metadata, scan policy, target mapping, accepted extensions, and blocked actions without rendering a live file input element.

## Consequences

- Future upload controls have a clear UI target.
- The foundation route still cannot select, drag, drop, store, scan, or promote files.
- Active route verification guards `No file input element`, `Select file blocked`, and `Create intake record blocked`.
