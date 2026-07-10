# DR-089: Teacher Training Recovery Trigger Settings

## Decision

Training Academy recovery trigger thresholds are part of teacher session settings.

## Reason

Recovery recommendations need to be explainable to teachers before a real classroom pilot. The foundation defaults are deterministic, but teacher-adjustable thresholds must eventually persist with the launch session so all student devices share the same rule.

## Standard

- Repeated missed checks default to 2.
- Low completion reward threshold defaults to 120 Star Dust or below.
- High attempt ratio threshold defaults to 2.25x or higher.
- Recovery rewards remain deterministic.
- Teacher-adjustable thresholds require persistence before classroom use.

