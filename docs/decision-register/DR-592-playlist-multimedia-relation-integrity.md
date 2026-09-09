# DR-592: Playlist And Multimedia Relation Integrity

Status: Accepted

Decision: Require every playlist and multimedia plan to describe one unambiguous, structurally usable media pathway.

Guardrails:

- Playlist identifiers, titles, and at least one media asset are required.
- A playlist cannot repeat a media asset ID.
- A content package has at most one multimedia plan per unit.
- Background media cannot be enabled by default without a declared background asset.
- Storage, upload, playback, release, QR, and student use remain behind separate gates.

Recorded in `docs/adr/0521-playlist-multimedia-relation-integrity.md`.

