# DR-486: Teacher Session Settings Workbench Route

Status: Accepted

Decision: Add a focused `/teacher/session-settings` route for review-only launch-session settings before any live teacher setting save or classroom launch workflow exists.

White-label impact: Strongly positive. Schools and publishers can review tenant-specific choices for support language, microphone practice, background media, AI Tutor package tier, and reporting policy without MiniStar-only assumptions.

Cost impact: Positive. A static review workbench is cheaper than prematurely adding persisted settings UI, authentication, or storage writes, while still clarifying the exact future storage shape.

Constraints:

- No setting save, live classroom launch, report export, raw microphone audio upload, AI Tutor activation, support-language progression, or background-media mastery can originate from the route.
- Target-language-only progress and learner audio priority remain visible on the page.
- Route verification must check the workbench before the route is treated as part of the foundation surface.
- Hosted and closed-local persistence adapters must preserve the settings snapshot and review packet before real classroom settings are enabled.

Follow-up: When a backend/local persistence adapter is selected, promote this workbench from sample snapshots to durable launch-session settings review records without changing the student progression rules.
