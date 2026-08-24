# DR-507: AI Request-To-Draft Handoff Preview

Status: Accepted

Decision: Teacher generator routes must show a review-only handoff from the reviewed request packet to the target draft JSON preview before provider integrations, model calls, billing, draft generation, verifier submission, package assembly, routes, playlists, assignments, or support-language progress can exist.

Reason: The generator now has a request packet preview and downstream draft/package review surfaces. The risky gap is the moment between "request looks ready" and "draft appears." A visible handoff keeps that boundary review-first and prevents accidental live AI behavior.

White-label impact: Positive. Publishers and schools can inspect what evidence would pass from request to draft without committing to one AI provider or backend vendor.

Cost impact: Positive. Model usage, voice generation, speech scoring, and provider billing remain blocked until adult approval and storage/review gates exist.

Constraints:

- Handoff mode remains `review-only-preflight`.
- Target-language activity remains the only progress trigger.
- Support-language activity, media-only engagement, and Japanese support-language cues cannot unlock progress.
- Handoffs must name request packet, prompt package, cost gate, target-language audio, activity compatibility, media rights, and draft-preview lanes.
- Handoffs must block live model dispatch, model billing, draft generation, draft JSON writes, verifier submission, package assembly, route writes, playlist writes, assignments, student-ready markers, and support-language progress.
