# DR-488: Package Entitlement Workbench Route

Status: Accepted

Decision: Add `/teacher/entitlements` as a focused, review-only package boundary for optional paid AI generation, Voice Tutor, microphone scoring, speech APIs, hosted storage, report export, and local companion mode.

White-label impact: Strongly positive. Schools and publishers can see exactly what belongs in the base classroom package and what requires a premium entitlement, school approval, or tenant package decision.

Cost impact: Positive. The route keeps expensive services visible but disabled, preventing accidental model billing, speech API usage, hosted storage spend, or report/export infrastructure before the package model is accepted.

Constraints:

- No live model billing.
- No package activation.
- No child-facing premium upsell.
- No microphone permission prompt from the entitlement workbench.
- No raw audio or transcript storage.
- No report export, object storage write, local folder write, or release-state mutation.
- AI Tutor, speech scoring, and Voice Tutor remain optional premium packages controlled by tenant/school policy.

Follow-up: When package pricing and school policy acceptance are ready, promote this route's entitlement boundaries into durable package records before enabling teacher-side paid feature toggles.
