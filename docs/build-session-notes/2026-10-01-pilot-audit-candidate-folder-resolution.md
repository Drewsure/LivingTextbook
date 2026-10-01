# Build session: Make single-package extraction handoff operator-safe

The first-pilot audit now discovers one nested Z.ai candidate package inside
an outer extraction folder and rejects ambiguous folders instead of guessing.
The self-test covers both cases. The resolved candidate remains outside the
repository and is still checked by the canonical evidence-return verifier.

Recorded under ADR 1416 / DR-1416.
