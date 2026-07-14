# DR-204: Draft Content Entry Workbench Preview

## Decision

Add a disabled content-entry workbench preview to the sample teacher draft route.

## Rationale

The platform needs a future-friendly authoring surface, but live editing, uploading, AI generation, template switching, and Done-to-student routing must remain blocked until the review and storage foundation is ready.

## Implications

- `http://127.0.0.1:3000/teacher/authoring/draft-sample-publisher-l1-u1` now shows a draft content-entry workbench preview.
- The route shows title, instruction, single/double sided rows, front/back fields, audio cue requirements, image upload positions, formatting tools, row actions, add item, AI draft help, flip tiles, item limits, and Done.
- Save, upload, publish, assignment, direct AI publish, template switching, file picker writes, and Done-to-student routing remain blocked.
- Future live authoring must preserve draft persistence, audio coverage, upload intake/review/promotion, compatibility, review handoff, and release gates.

## Next

Use this preview as the route-level structure for the future teacher authoring workbench after persistence and review workflows are selected.
