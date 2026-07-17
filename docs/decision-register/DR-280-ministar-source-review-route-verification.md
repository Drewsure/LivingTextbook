# DR-280: MiniStar Source Review Route Verification

## Decision

Add active route verification for `/teacher/sources/ministar`.

## Why

MiniStar is the flagship tenant and should be protected by the same source-review gate as white-label textbook partners. The master curriculum DOCX needs a visible, tested review route before extraction, teacher draft generation, package release, or student assignment.

## Guardrails

- MiniStar source extraction remains review-first.
- The master DOCX cannot become a direct student payload.
- Hiragana-only support-language review for Foundation/Bronze/Plus remains visible in the source review route.
- The same required extraction-promotion records apply to MiniStar and partner tenants.

## Verification

`npm run verify:source-review` and `npm run verify:foundation` must pass after MiniStar source review, curriculum extraction, support-language review, package drafting, or active route matrix changes.
