# DR-1008: Multilingual Media Language Role

Decision: policy-bound audio and video assets must declare target, assist, or
neutral language role and match the configured language set.

Required invariants:

- Target-language media matches the package target language.
- Assist-language media matches a configured assist language.
- Neutral media may be language-independent.
- Images retain their existing labelled-diagram and accessibility review path.
- Media role evidence cannot activate release or assignment.

Evidence: `docs/adr/0936-multilingual-media-language-role.md`,
`packages/content-model/src/index.ts`, and
`scripts/verify-runtime-behavior.mjs`.
