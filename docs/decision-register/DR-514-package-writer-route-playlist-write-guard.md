# DR-514: Package Writer Route And Playlist Write Guard

Status: Accepted

Decision: Add a review-only route and playlist write guard after the package writer harness implementation decision.

Reason: Generated package writer work will eventually touch stable URLs, QR links, media playlists, and teacher/student route boundaries. Those surfaces need their own guard before any writer or harness work can be considered.

White-label impact: Positive. Each tenant can preserve its own URL, media, language, and classroom policy rules while sharing one route/playlist protection model.

Cost impact: Positive. Route, playlist, and QR mistakes are costly to unwind. The guard keeps that work blocked until evidence and release controls exist.

Constraints:

- Route registry writes, media playlist writes, production QR redirect mutation, and student-facing route activation remain blocked.
- Stable QR deep-link smoke checks, target-language route checks, teacher route isolation, media-rights checks, target-language-audio-first playlist checks, and background media opt-in checks are required.
- Support-language-only route or playlist approval remains blocked.
- MiniStar route and playlist guards must preserve English target-language trigger and hiragana-only Japanese support.
