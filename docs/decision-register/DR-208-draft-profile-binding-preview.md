# DR-208: Draft Profile Binding Preview

## Decision

Show template rendering and font accessibility profile bindings inside the draft content-entry workbench preview.

## Rationale

The draft route already displays the future authoring controls. It also needs to show the profile records behind those controls, otherwise a later build could accidentally make template switching or tenant font use appear local to the workbench.

## Implications

- `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Profile binding preview`.
- The route shows the sample `template_rendering_profile` and `font_accessibility_profile` ids.
- Student-facing rendering and font use remain visibly blocked.
- Teacher authoring verification now guards this profile dependency.

## Next

When live authoring begins, profile selection must be an admin-reviewed binding, not a free-form teacher switch.

