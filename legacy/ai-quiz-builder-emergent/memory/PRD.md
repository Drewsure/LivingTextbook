# Ministar Game Studio - Product Requirements Document

## Original Problem Statement
Build a gamified ESL/EFL teaching platform called "Ministar Game Studio". The core requirement is a "NO FRICTION" approach for teachers. Teachers should be able to upload a worksheet (as an image, PDF, or pasted text), and the platform's AI should automatically analyze it to generate a variety of engaging, interactive, and visually appealing games for students.

## Core Requirements
1. **AI-Powered Game Generation**: AI must accurately analyze uploaded worksheets to identify theme, grade level, keywords, and learning objectives
2. **Frictionless Teacher Experience**: Minimal teacher input required
3. **Engaging Student Experience**: Games must be visually appealing and interactive (gold standard: wordwall.net)
4. **Multi-language Support**: Instructions in teacher's selected language (Japanese, English)
5. **Student Progression & Gamification**: Leaderboard system

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: FastAPI (Python), MongoDB
- **AI**: Google Gemini via Emergent LLM Key
- **PDF Generation**: fpdf2

## Completed Features (as of Feb 6, 2026)

### Sprint 1 - Core Platform
- [x] User authentication (Teacher/Student registration & login)
- [x] Teacher Dashboard with stats
- [x] Worksheet upload (file, image, text paste)
- [x] AI worksheet analysis with Gemini (theme, keywords, grade level, objectives)
- [x] Re-analyze button for teachers if AI misinterprets
- [x] Game generation (Word Match, Quiz, Flashcards, Spelling Practice, Word Search, Matching Pairs)
- [x] Student game portal
- [x] Leaderboard system

### Sprint 2 - QR Code & Auto-proceed (Completed Feb 6, 2026)
- [x] **Printable QR Code Worksheet PDF**
  - Main QR code linking to Games Landing Page (all games)
  - Individual QR codes for top 6 games
  - Downloadable PDF with worksheet title, theme, grade level
- [x] **Games Landing Page** (`/games/{worksheetId}`)
  - Public page showing all games for a worksheet
  - Japanese/English instructions
  - Beautiful card-based game selection UI
- [x] **Auto-proceed on Correct Answer**
  - Quiz game automatically advances to next question after 1.5s on correct answer
  - Celebratory confetti and audio feedback
- [x] **Teacher Preview Mode**
  - Preview games without leaving dashboard
  - Full-screen modal with game embedded
  - Quick access to Share Code and share dialog
  - "Open Full" option to view in new tab
- [x] **Batch Generate Games**
  - Generate games for multiple worksheets at once
  - Selectable worksheet grid with theme preview
  - Progress tracking during batch generation
- [x] **Favorite Games**
  - Star icon to mark games as favorites
  - Favorites appear at top of list with amber highlight
  - Dedicated "Favorites" tab to filter view
  - Toggle favorite with single click

- [x] **Analytics Dashboard**
  - Full-screen analytics view with tabs: Overview, Games, Distribution
  - Summary cards: Total Games, Total Plays, Completed, Avg Score, Players
  - Top performers: Most Played, Highest Scoring, Best Completion Rate
  - Game performance table with all metrics
  - Pie charts and bar charts for game type & theme distribution
- [x] **Word Climber (Donkey Kong Style) Game**
  - Platformer-style vocabulary game
  - Player climbs platforms using arrow keys and space to jump
  - Collect correct words while avoiding wrong answers (rolling barrels)
  - Multiple levels with increasing difficulty
  - Combo scoring system
  - Mobile touch controls for phone/tablet

### Sprint 3 - Image Extraction & Themes (Completed Feb 6, 2026)
- [x] **Extract Images from Uploaded Worksheets**
  - Automatic extraction from PDFs using PyMuPDF
  - Image extraction from DOCX files
  - Direct image file support
  - Images stored as base64 and passed to games
  - Games prioritize worksheet images over Unsplash placeholders
- [x] **Audio for Answer Options**
  - Each quiz answer has a visible speaker button
  - Click to hear TTS pronunciation
  - Hover also triggers audio
  - Helps students learn pronunciation
- [x] **Wordwall.net-Style Visual Themes**
  - 8 themed visual styles: Safari, Ocean, Space, Jungle, Candy, Winter, Ninja, Rainbow
  - Theme auto-selected based on content keywords
  - Animated theme particles (animals, snowflakes, stars, etc.)
  - Theme-colored gradients, borders, and UI elements
  - Theme indicator badge in games

### Sprint 4 - Advanced Features (Completed Feb 6, 2026)
- [x] **Theme Selector for Teachers**
  - Visual grid of 8 themes + Auto option
  - Teachers manually choose theme before generating games
  - Selected theme passed to all generated games
  - Auto mode still available for keyword-based selection
- [x] **Student Progress Tracking**
  - Public `/progress` page for students to view their stats
  - Tracks: Games Played, Average Score, Best Score, Day Streak
  - Badge system: Starter, Dedicated, Master, Perfectionist, Week Warrior, Month Master
  - Recent activity log with session details
  - Progress automatically updated when submitting to leaderboard
- [x] **Leaderboard Localization**
  - All leaderboard text translatable via translations.js
  - Japanese and English support
- [x] **Video Clip Support**
  - Games can include video URLs
  - Video player embedded in quiz questions
  - Poster image fallback
- [x] **AI Theme Monitoring**
  - Automatic logging of all theme analyses
  - `/admin/theme-analysis-stats` endpoint for accuracy tracking
  - Theme distribution and recent analyses available

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/worksheets/upload` - Upload worksheet file
- `POST /api/worksheets/analyze-text` - Analyze pasted text
- `POST /api/worksheets/{id}/reanalyze` - Re-analyze worksheet
- `GET /api/worksheets/landing/{id}` - Get landing page data (public)
- `GET /api/worksheets/{id}/print-qr` - Generate QR PDF
- `POST /api/games/create` - Create game
- `GET /api/games/by-code/{code}` - Get game by share code
- `GET /api/games/worksheet/{id}` - Get games for worksheet
- `POST /api/leaderboard` - Add leaderboard entry
- `GET /api/leaderboard/game/{id}` - Get game leaderboard

## File Structure
```
/app
├── backend/
│   ├── server.py         # FastAPI app, all endpoints
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── StudentPortal.js
│   │   │   ├── GamePlayer.js
│   │   │   ├── GamesLandingPage.js  # NEW
│   │   │   └── LandingPage.js
│   │   ├── components/
│   │   │   ├── games/
│   │   │   │   ├── UltimateQuizGame.js
│   │   │   │   ├── UltimateSpellingGame.js
│   │   │   │   └── ... other games
│   │   │   └── Leaderboard.js
│   │   └── utils/
│   │       ├── translations.js
│   │       └── images.js
│   └── package.json
└── memory/
    └── PRD.md
```

## Backlog / Future Tasks

### P1 (Medium Priority)
- [ ] More game types with themed variations
- [ ] Teacher dashboard for viewing all student progress

### P2 (Lower Priority)
- [ ] Spelling game placeholder text translation
- [ ] Export student progress as PDF
- [ ] Multiplayer/competitive game modes

### Scalability Recommendations (for future)
- Migrate SQLite → PostgreSQL/MongoDB (DONE - using MongoDB)
- Cloud storage (S3) for worksheets/PDFs
- Redis for session management
- CDN for static assets
