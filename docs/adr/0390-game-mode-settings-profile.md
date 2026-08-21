# ADR 0390: Game Mode Settings Profile

Status: Accepted

Context: Teachers will eventually expect timer, difficulty, visual style, motion, audio, and gameplay options. Those settings affect child safety, accessibility, lesson flow, and scoring. If implemented too early as live controls, they could accidentally create speed pressure, support-language-only progress, or tenant-specific scoring drift.

Decision: represent active mode settings as review-only profiles first. The profile is visible in teacher intake and covered by `npm run verify:game-settings`, but it does not save teacher choices or change student gameplay.

Consequences:

- Settings become part of the foundation gate before polish.
- Future controls have a clear contract for safe defaults, teacher review, and release gates.
- The product remains white-label friendly because tenant defaults can be reviewed without hard-coding MiniStar behavior.
- Live setting persistence remains blocked until school policy, persistence, accessibility, and release-control gates are accepted.
