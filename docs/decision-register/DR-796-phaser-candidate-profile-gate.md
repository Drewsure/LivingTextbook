# DR-796: Phaser Candidate Profile Gate

The external Phaser evidence verifier now uses explicit approved candidate
profiles. Memory Match maps to `pairing` and requires the four baseline
deterministic scoring scenarios; Balloon Pop maps to `selection` and also
requires a `miss` scenario. Fixture and event metadata must match the selected
profile. This expands reviewability without permitting source import, route
replacement, package promotion, or student assignment. See ADR 0722.
