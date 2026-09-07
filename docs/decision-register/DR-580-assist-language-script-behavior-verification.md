# DR-580: Assist-Language Script Behavior Verification

Status: Accepted

Decision: Execute the shared Japanese assist-language script validator in the compiled foundation behavior harness.

Guardrails:

- Foundation, Bronze, and Plus student-visible Japanese assist must be hiragana-only.
- Hiragana-only content rejects katakana and kanji.
- Silver-or-later mixed script requires reviewed policy.
- Assist language remains support-only and cannot enter progression authority.
