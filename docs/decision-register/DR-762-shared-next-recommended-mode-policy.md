# DR-762: Shared Next Recommended Mode Policy

The next student activity is the first uncompleted mode in the tenant's
ordered `recommendedNextModes` list. Launch surfaces must not read array item
zero as a permanent next step.

The shared helper is responsible only for ordering and completion state.
Unlock state is checked by the calling surface. Training Academy recovery
source selection is intentionally excluded because it answers a different
question.

See ADR 0690 and the canonical integration verifier.
