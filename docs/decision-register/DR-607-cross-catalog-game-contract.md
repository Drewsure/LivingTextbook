# DR-607: Cross-Catalog Game Contract

Status: Accepted

Decision: Extend the existing game-mode verification gate to compare the shared content-model compatibility contract with the web game catalog for every mode.

Rationale:

- Runtime and web layers carry related game contract data separately.
- One-sided changes can leave routing and review metadata inconsistent.
- A single existing verifier is cheaper and clearer than parallel drift checks.

Guardrails:

- Every mode appears exactly once in both contracts.
- Family, parent engine, and supported-level ranges must match.
- Missing, extra, and duplicate entries fail verification.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.
