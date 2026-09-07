# ADR-0509: Assist-Language Script Behavior Verification

Status: Accepted

## Context

Japanese assist language is intended to support young learners and must not become a second progression channel. Its script policy also needs to be safe for the Foundation, Bronze, and Plus levels while leaving a reviewed mixed-script path for later levels.

## Decision

Execute the shared `validateAssistLanguageScriptPolicy` contract in the compiled foundation behavior harness.

The harness covers:

- early-level mixed-script rejection;
- hiragana-only rejection of kanji or katakana;
- reviewed mixed-script acceptance for Silver-or-later content.

## Consequences

- Japanese script safety is enforced below the UI and AI authoring surfaces.
- Assist language remains optional support and cannot affect mastery or unlocks.
- Future assist languages can use the same white-label policy boundary without inheriting Japanese-specific assumptions.
