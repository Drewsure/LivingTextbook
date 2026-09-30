# ADR 1336: Render Live Evidence Binding In Source Review

## Status

Accepted for the foundation and pilot-review track.

## Decision

When a source review workspace has a real quarantine identity, render a
teacher-facing panel that requests the existing tenant-authorized
source-to-package evidence binding and displays its bounded evidence lanes.

The panel is an explicit read action. It does not auto-load or infer approval,
and it must preserve the API's rejection, authorization, and no-payload
boundaries.

## Rationale

An API-only binding is difficult for a publisher or teacher to use during a
review meeting. The source workspace is already the correct place to inspect
the evidence journey, so a small read panel makes the pilot flow tangible
without creating a second authority or a new side-effect path.

## Consequences

- A real quarantine submission can be inspected from one teacher workspace.
- The eight evidence lanes remain visible and consistent with the reference
  MiniStar bridge.
- Authorization failures remain visible as bounded review errors.
- Approval, package assembly, QR printing, persistence activation, and student
  access remain separate gates.
