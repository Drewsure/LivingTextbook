# DR-159: Teacher Assist Language Toggle

## Decision

Make assist-language visibility teacher-controlled in the current local scaffold.

## Rationale

Support language is useful for comprehension, especially for young learners, but schools and teachers need control over when it appears. Default-off support also reinforces that target-language learning remains the progression path.

## Accepted Direction

- Add a teacher support-language control on `/teacher`.
- Store the scaffold setting locally in the browser.
- Hide assist language from student flashcards unless enabled.
- Keep assist-language taps non-scoring and non-unlocking.
- Keep this separate from UI localization, AI Tutor, and target-language expansion.

## Follow-Up

Promote this local setting into persisted launch-session settings before real classroom use.
