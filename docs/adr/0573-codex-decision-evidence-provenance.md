# ADR 0573: Codex Decision Evidence Provenance

Status: Accepted

## Decision

Populate Codex integration-decision checks from the corresponding upstream
wrapper, fixture, event, audio, mobile, and scoring records.

The mapping rules are:

- explicit `reviewed` or `passed` records become reviewed checks;
- explicit pending-review records remain pending review;
- not-started, not-run, missing, blocked, unknown, or absent records remain
  blocked checks;
- readiness-gate evidence becomes reviewed only after every upstream check is
  reviewed;
- the MiniStar support-language boundary remains an independent protected check.

## Context

The decision record had begun deriving its overall status from its checks, but
the checks themselves still used hand-authored pending or blocked values. That
left the final review boundary disconnected from the evidence records it was
supposed to summarize.

## Consequences

- Reviewers can trace the Codex decision state back to the actual evidence
  records.
- Missing or unfinished external prototype work remains visibly blocked.
- The final decision cannot bootstrap itself or be satisfied by unrelated
  English-game evidence when MiniStar policy requires a support-language check.
- No approval, import, app patch, route mutation, scoring/reward change,
  playlist write, package promotion, or assignment is enabled.

## Verification

Web typecheck, runtime verification, production build, prototype review, and
active route checks remain required before this slice is pushed.
