# DR-753: Unit Star Dust Capacity

The application completion adapters now enforce the published 1,000 Star Dust
maximum per unit. Each completion event records only the remaining accepted
award, preserving deterministic scoring, continuity snapshot validity, teacher
report accuracy, and future overflow-ticket calculations. See ADR 0681.
