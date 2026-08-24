# DR-493: Release-Control Entitlement Source Gate

Status: Accepted

Decision: Release-control workspaces must link to the package entitlement workbench and keep premium package adoption, billing writes, microphone scoring, report export, hosted storage, and local companion activation blocked until policy, storage, and release gates close.

White-label impact: Positive. Publishers and schools can see package adoption decisions as part of release readiness without making MiniStar-specific assumptions or enabling a paid package from the release room.

Cost impact: Positive. Paid services remain blocked at the release layer, preventing accidental model, speech, storage, export, or support commitments during partner demo review.

Constraints:

- Release-control routes stay review-only.
- No package adoption, billing, speech scoring, report export, hosted storage, local companion, assignment, or publish action is exposed.
- Entitlement review remains an evidence source, not an activation source.

Follow-up: When accepted package adoption records exist, release control must require them as evidence before premium-dependent packages can become pilot-ready.
