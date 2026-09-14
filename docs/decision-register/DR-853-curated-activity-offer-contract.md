# DR-853: Curated Activity Offer Contract

`UnitGameOffer` and `UnitGameOfferMap` are neutral content/provider contracts,
not web-feature definitions. The web path remains a compatibility re-export so
existing screens can migrate without a flag day. Launch, student, teacher, and
dashboard surfaces consume curated maps from provider boundaries, preserving
white-label tenant substitution and pre-reviewed activity pathways. See ADR
0776.
