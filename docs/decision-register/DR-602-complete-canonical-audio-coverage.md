# DR-602: Complete Canonical Audio Coverage

Status: Accepted

The previous validator checked total cue count and whether each cue matched any canonical text. Eight unique cue IDs all saying the same valid word could pass while seven words had no audio.

Required audio coverage now checks each canonical vocabulary term and sentence for a referenced cue matching text, kind, tenant, unit, and target language. Existing whitespace and case normalization is preserved. Alternate recordings and cue ordering remain flexible.

Regression tests reject repeated valid text under distinct IDs and accept complete coverage, alternate recordings, normalized text, and reordered lists. This change requires no provider calls or additional service costs and applies to every tenant.
