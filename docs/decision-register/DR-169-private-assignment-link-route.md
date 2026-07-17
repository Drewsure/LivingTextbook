# DR-169: Private Assignment Link Route

Decision: Add `/assign/[assignmentId]` as the first private assignment-link scaffold.

Rationale: Teachers need fast, focused student links. The safe v1 answer is a tenant-scoped private assignment preview, not public community sharing or iframe embeds.

Implications:

- MiniStar and sample publisher each have an active private assignment link route.
- The active route matrix grows from 31 to 33 checked routes.
- Assignment links point students to the correct direct launch or front-door path.
- Reporting and exports remain blocked until persistence, retention, and policy are accepted.

Follow-up completed: `DR-274-private-assignment-link-storage-contract.md` defines the backend-neutral `private_assignment_link` record. Real access links still require backend selection, access policy, retention policy, and school approval before live use.
