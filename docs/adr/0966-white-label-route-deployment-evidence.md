# ADR 0966: White-label route and deployment evidence binding

## Decision

White-label release readiness must carry explicit route and deployment evidence
for the same tenant/package review record. The evidence must reconcile the
active route count with the active route matrix and name the verifier and
deployment decision guide used for review.

## Rules

- Active and expected route counts must reconcile exactly.
- The route matrix, active-route verifier, and deployment guide remain named
  source records rather than duplicated status prose.
- Deployment status in this evidence packet is `review-only`.
- Route health never authorizes student launch, durable persistence, QR
  redirect mutation, offline delivery, installer export, or package promotion.
- Historical route counts remain historical; current evidence uses the current
  route matrix.

## Consequences

The release-readiness surface can expose route/deployment drift early without
turning a healthy route sweep into a release button. A route addition now has a
visible reconciliation point in the white-label evidence packet.

