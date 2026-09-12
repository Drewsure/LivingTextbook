# DR-729: Target-Language Feedback Audio

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / canonical audio

## Decision

Canonical game feedback must speak and record with the unit target language.
True or False now emits feedback audio evidence through the shared adapter
instead of hard-coding English for its immediate correctness response.

## Consequences

- White-label target-language units keep consistent audio behavior.
- Teacher evidence can distinguish feedback audio from answer scoring.
- Support-language audio remains non-authoritative for mastery and rewards.
- Future Phaser wrappers must map feedback cues through the same target-language
  rule.
