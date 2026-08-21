# DR-465: AI Generator Settings Contract Gate

Decision: require AI-generated game drafts to name game mode settings profile references and backend settings gates before package review.

Rationale: Generated game content should not be able to arrive as a polished draft while silently skipping timer, difficulty, motion, attempts, background media, skin, arcade speed, scoring, or learning-audio rules. The generator must carry the same settings backend contract as teacher-created content before any future route, package, playlist, or assignment workflow can consider it.

Scope:

- Add settings contract rule and backend records to the AI teaching game generator plan.
- Add settings profile references and backend gates to each sample generator request.
- Show settings contract, settings backend records, settings profile refs, and settings backend gates in the AI generator panel.
- Extend AI generator and active route verification.

Boundaries:

- No live model call.
- No package review promotion.
- No route, playlist, local bundle, or assignment creation.
- No live settings persistence.
- No scoring profile override.
- No support-language-only progress.
