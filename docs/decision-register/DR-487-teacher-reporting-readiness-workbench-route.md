# DR-487: Teacher Reporting Readiness Workbench Route

Status: Accepted

Decision: Add `/teacher/reporting` as a focused, review-only reporting boundary before live report export, production learner accounts, or persistent student event storage exists.

White-label impact: Strongly positive. Schools and publishers can see what reporting would include and exclude before a tenant chooses hosted, local, or hybrid persistence.

Cost impact: Positive. Static report-readiness review is cheaper than prematurely implementing export infrastructure, privacy workflows, account systems, or local report sync.

Constraints:

- No live report export.
- No real learner data collection.
- No raw learner audio or transcripts in the core reporting tier.
- No ungated AI Tutor state in core reports.
- Support-language taps, route guidance, media playback, and background media remain support-only/report-only.
- Event acceptance, school policy, persistence, retention, access, and format rules must pass before export work begins.

Follow-up: When persistence is selected, promote this route's report package boundary and roster identity model into durable report package records before any export button is designed.
