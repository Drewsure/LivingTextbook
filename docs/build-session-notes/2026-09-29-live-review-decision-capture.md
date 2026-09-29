# Build session: Live review decision capture

- Added the controlled handoff capture form for the existing quarantine review
  decision route.
- Wired the server-side review-decision feature gate into the live handoff.
- Made the form read-only when an immutable decision already exists.
- Preserved same-origin authorization, tenant/package/quarantine binding,
  conflict rejection, and all release and student-use blockers.
- Added focused verifier coverage and standing decision records.
