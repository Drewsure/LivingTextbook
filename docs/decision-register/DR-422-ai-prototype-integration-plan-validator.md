# DR-422: AI Prototype Integration Plan Validator

Date: 2026-08-14

## Decision

AI prototype integration plans now use a shared content-model validator before wrapper adapter work, app patch planning, route planning, scoring changes, audio manifest changes, package promotion, or assignment can be considered.

## Rationale

The integration plan is where returned prototype evidence can become tempting to wire into the app. A shared validator keeps the plan wrapper-first, adds explicit scoring replay lineage, and preserves quarantine, event, audio, mobile, white-label, and Codex decision gates before any app-facing work begins.

## Rules Preserved

- Integration plans stay review-only and depend on `ai_prototype_return_review`.
- Required source records include the generated build brief, standard event contract, audio cue manifest, scoring profile snapshot, activity compatibility snapshot, and package audio coverage.
- Integration lanes must include quarantine, wrapper adapter proposal, fixture replay, event replay, target-language audio coverage, deterministic scoring replay, mobile/accessibility inspection, and Codex decision.
- Next review records must include wrapper adapter, fixture replay, event replay, audio coverage, mobile accessibility, scoring replay, and Codex integration decision records.
- Mode plans must keep a fixture-driven adapter boundary and block route, scoring, audio, tenant, and assignment ownership.
- Direct imports, route writes, game sequence mutations, scoring mutations, audio manifest mutations, package promotion, and student assignment remain blocked.
- MiniStar plans must preserve hiragana-only Japanese support evidence and block Japanese support-language scoring or release.

## Consequences

Teacher generator routes now surface `Integration plan guard active`, `Integration plan guard blocks`, and `Integration plan guard warnings`. `verify:ai-generator` fails if the shared validator, scoring replay next-record requirement, sample guard exports, or visible integration-plan guard labels are removed.
