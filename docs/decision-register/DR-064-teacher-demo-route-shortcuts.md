# DR-064: Teacher Demo Route Shortcuts

## Decision

Expose current scaffold route shortcuts on the teacher launch page.

## Rationale

As the vertical slice grows, demos and local verification become slower if routes are only known from documentation. A teacher-facing shortcut block improves practical testing while keeping production QR policy unchanged.

## Consequences

- Local demos can reach the main playable routes faster.
- Future route additions should use shared helpers before appearing on the teacher page.
- Printed textbook QR rules remain governed by the route registry and package release gates.

## Non-Goals

- Production classroom navigation.
- Permanent QR aliasing.
- Authentication or role-based routing.
