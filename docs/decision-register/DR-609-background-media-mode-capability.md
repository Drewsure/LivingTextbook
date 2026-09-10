# DR-609: Background Media Mode Capability

Status: Accepted

Decision: Make background-media capability part of the shared mode contract and reject multimedia plans that name a mode without that capability.

Rationale:

- Ambient media can interfere with precision learning tasks.
- A supported mode ID alone does not prove background media is appropriate.
- Package validation and the web catalog must agree before teacher settings interpret the plan.

Guardrails:

- Capability is explicit per curated mode.
- Disallowed modes remain package review blockers.
- Learning audio remains higher priority and ambient media cannot create progress.
- No playback, autoplay, persistence, or student-state side effect is introduced.
