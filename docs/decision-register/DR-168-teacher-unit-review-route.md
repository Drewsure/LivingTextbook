# DR-168: Teacher Unit Review Route

Decision: Make `/teacher/units/[unitKey]` an active scaffold for package review before assignment.

Rationale: The platform needs a teacher-friendly review page that sits between broad admin intake and student launch. This supports white-label partners, keeps curated activity pathways visible, and avoids pretending that every reviewed package is automatically pilot-ready.

Implications:

- MiniStar and sample publisher now have active teacher unit review routes.
- The active route matrix grows from 29 to 31 checked routes.
- Teacher launch shortcuts include the unit review page.
- The route remains review-only until persistence, approval, and publish gates are accepted.

Next: When teacher authoring and assignment persistence are implemented, this route can become the natural place to approve, clone, or schedule a reviewed unit package.
