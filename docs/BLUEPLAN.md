# Living Textbook White-Label Platform Blueplan

Document type: strategic product, architecture, curriculum, and AI-agent build directive

Repository: `Drewsure/LivingTextbook`

Primary branch for current planning/build work: `legacy-source-import`

## 1. Core Positioning

The Living Textbook platform is first and foremost a white-label, saleable learning platform.

MiniStar English Lab is the flagship curriculum, first tenant, and proof-of-value implementation. The MiniStar curriculum is extremely useful because it gives the build a real 8-level / 320-unit structure, but the platform must not be architected as MiniStar-only.

The product must support:

- White-label schools, academies, publishers, and curriculum owners
- Tenant-specific branding, curriculum, avatars, game progression, QR routes, and teacher dashboards
- MiniStar English Lab as the first complete reference deployment
- A future catalog of saleable curriculum/game packages

## 2. Build Philosophy

This is not a project to build 48 separate games.

The platform should build a smaller number of reusable technical engines that can render many modes from standardized educational payloads.

Recommended model:

- 8 pedagogical game families for curriculum planning and teacher-facing organization
- 4 parent technical engines for implementation efficiency
- 48 game modes as configurations, skins, rule subsets, scoring profiles, and content mappings

This distinction is important. Teachers, parents, and students experience variety through game families and modes. Engineers maintain stability through parent engines and shared contracts.

## 3. Current Source Assets

The master repository has preservation copies of three legacy codebases on `legacy-source-import`:

- `legacy/ministar-game-studio-ai`
- `legacy/ministar-lab`
- `legacy/ai-quiz-builder-emergent`

Current strategic read:

### legacy/ministar-game-studio-ai

Likely role:

- Primary UI inspiration
- Early-level game modes
- Young learner experience
- Product pages and polished learning portal surface
- Supabase-era auth/data ideas

Why it matters:

The UI direction here appears closest to the intended student-facing experience. It should strongly influence the first public platform shell.

### legacy/ministar-lab

Likely role:

- Mid-to-later-level arcade and Phaser-style game ambition
- Advanced game engine experiments
- Multi-tenant/schema concepts
- Z.ai-generated high-ceiling gameplay source

Why it matters:

This is where more advanced interactive/arcade ideas live. It has promise, but it needs strict architecture, refactoring, and engine contracts before becoming production core.

### legacy/ai-quiz-builder-emergent

Likely role:

- Worksheet ingestion
- AI analysis
- QR/share flows
- Teacher/student backend workflows
- PDF/DOCX/image/text extraction
- FastAPI service reference

Why it matters:

This source is less important visually but very important structurally. It contains many of the practical classroom workflows the platform needs.

## 4. Product Modes From Day One

The platform must be both:

- Teacher-led classroom tool
- Student self-play progression app

The intended first student entry path is teacher-directed QR onboarding:

1. Teacher assigns or displays a QR code.
2. Student scans the QR code.
3. Student enters a practice flow, likely starting with flashcards.
4. Completion unlocks progression to the next game mode.
5. Student motivation continues through Star Dust, avatar progress, and mastery loops.

This creates a healthy division of control:

- Teacher starts the journey.
- Student momentum continues the journey.

## 5. Canonical Content Rule

Earlier drafts used 12 vocabulary terms. The clarified MiniStar curriculum default is 8 key words per unit, with occasional units containing up to 12.

Decision:

- Canonical unit default: 8 vocabulary terms
- Allowed range: 8-12 terms
- Training Academy / adaptive sessions: 8-12 terms depending on remediation or enrichment need
- AI Authoring Studio must validate that every generated unit stays within this range

The target sentence rule remains:

- Exactly 2 target sentence structures per unit

This means the core pedagogical payload becomes:

```json
{
  "pedagogical_payload": {
    "vocabulary_terms": ["8 to 12 strings"],
    "target_sentences": ["sentence pattern 1", "sentence pattern 2"]
  }
}
```

## 6. Avatar / Brand Identity Direction

Cloud Dog and Star Kid are not final locked characters yet.

Current decision:

- Student avatar choice is important.
- The system should support selectable avatar families.
- Star Dust and avatar evolution remain core engagement systems.
- Cloud Dog and Star Kid can be treated as first-party MiniStar flagship avatar families, not mandatory global white-label characters.

White-label implication:

A tenant should eventually be able to define or select its own avatar set. MiniStar may use Cloud Dog / Star Kid, but another school or publisher might use a different mascot set.

Recommended abstraction:

- `avatar_family`
- `avatar_stage`
- `cosmetic_inventory`
- `tenant_brand_rules`
- `visual_blacklist_rules`

## 7. Game Taxonomy

### 8 Pedagogical Families

1. Core Quiz / Assessment
2. Vocabulary & Matching
3. Memory & Sorting
4. Spelling & Typing
5. Syntax & Construction
6. Word Puzzles
7. Arcade / Action Learning
8. Speaking / Listening

### 4 Technical Parent Engines

1. Pairing Engine
2. Selection Engine
3. Text / Spelling Engine
4. Narrative Engine

Important note:

The 8 families are for curriculum and product planning. The 4 engines are for implementation.

Example mapping:

| Game Mode | Pedagogical Family | Parent Engine |
| --- | --- | --- |
| Flashcards | Vocabulary & Matching | Selection or Pairing |
| Memory Match | Memory & Sorting | Pairing |
| Balloon Pop | Arcade / Action Learning | Pairing or Selection |
| Whack-a-Mole | Arcade / Action Learning | Selection |
| Sentence Builder | Syntax & Construction | Text / Spelling |
| Fill in the Blank | Syntax & Construction | Text / Spelling |
| Word Search | Word Puzzles | Text / Spelling |
| Boss Battle | Core Quiz / Assessment | Selection or Narrative |
| Mystery Detective | Core Quiz / Assessment | Narrative |
| Dictation | Speaking / Listening | Text / Spelling |

## 8. AI Authoring Studio

The AI Authoring Studio should generate structured curriculum/game payloads, not final ad hoc game code.

Input variables:

- Tenant
- Curriculum
- Level
- Unit
- Theme
- Target game mode
- Target language
- Student age band
- Difficulty profile

Required output:

- Unit metadata
- 8-12 vocabulary terms
- Exactly 2 target sentence structures
- Game-mode adaptation notes
- Teacher Launch Protocol
- Visual prompt guidance
- Verification metadata

Recommended payload shape:

```json
{
  "unit_meta": {
    "tenant_id": "string",
    "curriculum_id": "string",
    "level": 1,
    "unit": 1,
    "theme": "Greetings",
    "game_mode": "Flashcards",
    "game_family": "Vocabulary & Matching",
    "engine_id": "Selection"
  },
  "pedagogical_payload": {
    "vocabulary_terms": [],
    "target_sentences": []
  },
  "game_payload": {
    "rounds": [],
    "scoring_profile": "string",
    "difficulty_flags": []
  },
  "visual_prompts": {
    "avatar_family": "string",
    "character_focus": "string",
    "visual_rules": [],
    "blacklist_check": {
      "passed": true,
      "notes": "string"
    }
  },
  "teacher_launch_protocol": {
    "hook": "string",
    "activity": "string",
    "review": "string"
  },
  "verification": {
    "term_count_valid": true,
    "sentence_count_valid": true,
    "level_match_valid": true,
    "game_mode_match_valid": true,
    "brand_rules_valid": true
  }
}
```

## 9. Vision-Reasoning Layer

The Vision-Reasoning Layer should not be decorative. It is the quality gate that prevents bad AI content from entering the student experience.

It should verify:

- Vocabulary term count is 8-12
- Exactly 2 target sentence structures exist
- Language level matches the assigned level
- Game mode matches the content type
- Visual rules are followed
- Tenant brand rules are followed
- Forbidden motifs are blocked
- Required output schema is valid

For MiniStar, early blacklist examples include:

- No pirate-boy visual drift
- No incorrect mascot anatomy
- No visual style that conflicts with the chosen tenant brand

For the white-label platform, this becomes tenant-specific:

- Each tenant can define visual restrictions and required motifs
- MiniStar restrictions become the first reference implementation

## 10. Star Dust Economy

The Star Dust system should remain outside the core game mechanics, but all games must report enough telemetry for it.

Updated scoring model should adapt from the original 12-term idea to the clarified 8-12 term reality.

Recommended canonical unit capacity:

- 1,000 Star Dust per unit
- Vocabulary: up to 300 Dust
- Syntax: up to 300 Dust
- Accuracy / reflex / completion bonus: up to 400 Dust

Vocabulary scoring should scale by term count.

Example:

- 8-term unit: 300 / 8 = 37.5 Dust per mastered term, rounded internally
- 10-term unit: 30 Dust per mastered term
- 12-term unit: 25 Dust per mastered term

Module rule:

- 4 units per module
- 4,000 maximum Star Dust per module
- 3,000 Dust threshold for evolution milestone
- Overflow above 3,000 converts to Spin Wheel tickets at 250 Dust per ticket

Training Academy rule:

If a student falls short of the 75% threshold, the system recommends specific review games based on low-scoring payload areas.

## 11. Teacher And Student Flow

### Teacher Flow

1. Select tenant/curriculum/level/unit.
2. Review AI-generated unit payload.
3. Approve or edit vocabulary and sentence structures.
4. Choose or accept recommended game progression.
5. Generate QR code for classroom launch.
6. Monitor student completion and mastery.
7. Trigger Training Academy review if needed.

### Student Flow

1. Scan QR code.
2. Enter student name/profile or continue saved identity.
3. Complete entry practice, usually Flashcards.
4. Unlock next mode.
5. Earn Star Dust.
6. Receive immediate feedback and encouragement.
7. Progress toward module milestone and avatar/cosmetic rewards.

## 12. Recommended First Build Slice

The first real build should not try to prove every advanced idea.

Recommended first slice:

- White-label shell with MiniStar as first tenant
- Level 1, Module 1
- Unit 1 sample payload
- Teacher QR launch
- Student flashcard practice
- Memory Match or Balloon Pop as second unlocked mode
- Star Dust scoring
- Basic avatar selection
- Teacher Launch Protocol display
- Minimal teacher dashboard showing launch link, QR, and progress

Why this is the right first slice:

- It proves the whole platform loop.
- It does not require all 48 modes.
- It supports both teacher-led and student self-play from day one.
- It gives a saleable demo structure.
- It lets us validate the UI direction from `legacy/ministar-game-studio-ai`.

## 13. Z.ai Agent Use

Z.ai can be valuable because it is currently available and produced the `ministar-lab` source. But it should be used inside strict boundaries.

Recommended Z.ai assignments:

- Isolated game mode prototypes
- Visual polish experiments
- Phaser/arcade mode improvements
- Single-engine tasks with a written contract
- Asset-generation experiments

Z.ai should not own:

- Canonical schema
- Repository architecture
- Auth/database decisions
- Cross-engine contracts
- Final integration decisions
- Security model
- Tenant model

Every Z.ai task should include:

- Target engine
- Expected input JSON
- Expected output events
- Scoring telemetry contract
- Accessibility requirements
- Mobile/PWA requirements
- Forbidden architectural changes

## 14. Build Issues And Risks

### Risk 1: Too Many Games Too Soon

Building 48 separate games would fracture the project.

Mitigation:

Build 4 parent engines and map modes to them.

### Risk 2: UI And Engine Mismatch

The preferred UI source and the strongest advanced engine source are different repos.

Mitigation:

Use `ministar-game-studio-ai` as UX direction and selectively port/refactor engine ideas from `ministar-lab`.

### Risk 3: Backend Fragmentation

The legacy repos include Supabase, Prisma, MongoDB, FastAPI, and local-storage approaches.

Mitigation:

Choose one canonical data direction before production code accelerates. Keep ingestion/AI as a possible separate service.

### Risk 4: AI Content Drift

AI may generate terms, sentences, or visuals that do not match level, tenant brand, or game mode.

Mitigation:

Require schema validation and a Vision-Reasoning Layer before content can be assigned to students.

### Risk 5: White-Label Requirements Arrive Too Late

If MiniStar-only assumptions enter the app too deeply, resale becomes harder.

Mitigation:

Make tenant, curriculum, brand, avatar family, and visual rules first-class from the start.

### Risk 6: Student Onboarding Friction

Young students may struggle with login/account creation.

Mitigation:

Use QR-first onboarding, simple classroom codes, and optional saved profiles.

## 15. Opportunities

### Opportunity 1: Saleable Platform Plus Flagship Curriculum

MiniStar becomes proof that the white-label platform works.

### Opportunity 2: AI-Generated But Teacher-Controlled Units

The system can make teachers faster without removing their judgment.

### Opportunity 3: Reusable Game Engines

Once the parent engines are stable, new modes become cheaper.

### Opportunity 4: Premium Student Engagement

Star Dust, avatar progression, Training Academy, Spin Wheel, and power ups create a coherent meta-loop.

### Opportunity 5: Classroom QR Workflows

QR onboarding makes the product practical in real classrooms.

### Opportunity 6: Directed AI Agent Builds

Z.ai and other tools can help build parts, while this repository preserves architectural control.

## 16. Immediate Next Decisions

Before major implementation, decide:

1. Canonical database/auth direction: Supabase-first, Prisma/Postgres, or hybrid.
2. Whether `legacy-source-import` should become the working main branch.
3. First tenant model: MiniStar hard-coded temporarily or tenant-configured from day one.
4. First avatar system: simple selectable avatars now, evolved mascot system later.
5. First game sequence: Flashcards -> Memory Match or Flashcards -> Balloon Pop.
6. Whether the AI Authoring Studio should be mocked first with static JSON or connected to a live AI service immediately.

## 17. Codex Role

Codex acts as the lead systems architect, integration engineer, and build governor for the repository.

Codex responsibilities:

- Preserve source material
- Define canonical architecture
- Prevent fragmentation
- Convert prototypes into production structure
- Maintain schema discipline
- Integrate useful code from legacy systems
- Write build directives for other AI agents
- Review Z.ai outputs before adoption
- Keep MiniStar useful without compromising white-label resale potential

Codex should not blindly merge every generated idea. The task is to shape the system into a coherent, premium, maintainable platform.

## 18. Current Strategic Recommendation

Use the next phase to build a small but complete vertical slice:

- White-label shell
- MiniStar tenant config
- QR teacher launch
- Student flashcard entry
- One second game mode
- Star Dust scoring
- Basic avatar choice
- Static validated JSON payload
- Teacher Launch Protocol

Do not connect live AI generation until the payload schema and verification rules are proven with static content.

This gives the platform a controlled first win and creates the contract that future AI agents, including Z.ai, must obey.
