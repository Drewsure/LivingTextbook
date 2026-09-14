# DR-815: Shared Scoring Profile Source

Require the shared content model to own the canonical game-mode scoring map
and profile identifier type. Web catalogs and scoring helpers consume that
map directly, with total lookup across supported modes. This prevents scoring
profile drift without enabling live persistence, progression, rewards,
assignment, or Phaser source promotion.
