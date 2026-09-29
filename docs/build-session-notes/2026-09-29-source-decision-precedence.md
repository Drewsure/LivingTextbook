# Build session: Source decision precedence

- Required an accepted source-review decision before package-review packet
  capture.
- Added the same prerequisite to the live handoff control and server route.
- Preserved explicit blocked messages for missing and changes-required states.
- Prevented an immutable blocked packet from becoming a dead-end snapshot.
- Added verifier and standards coverage for the sequencing rule.
