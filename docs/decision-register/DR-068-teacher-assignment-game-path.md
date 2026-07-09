# DR-068: Teacher Assignment Game Path

## Decision

Add Quiz and Sentence Builder to sample teacher assignment target modes and display the assigned game path in the teacher assignment readiness panel.

## Rationale

The student launch flow now exposes a larger recommended game path. Teacher/admin readiness must reflect the same route set so the build remains controlled by assignment policy rather than hidden route availability.

## Consequences

- Assignment plans now list the same core game path students can see after entry practice.
- Teacher intake can inspect game-path scope before persistence exists.
- Real teacher customization remains deferred until persisted launch-session settings exist.

## Non-Goals

- Saving custom teacher-selected game paths.
- Role-based assignment publishing.
- Premium game enablement.
