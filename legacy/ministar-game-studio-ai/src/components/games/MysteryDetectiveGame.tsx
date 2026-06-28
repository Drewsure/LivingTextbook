import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay, EmojiBurst } from "./effects/Particles";
import { ThemedBackground, getRandomTheme, GameTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playTickSound, playPowerUpSound, playCompleteSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { X, Volume2, VolumeX, Search, Users, Eye, Book, Lightbulb, CheckCircle, XCircle, Clock, Target, Fingerprint, Camera, MessageSquare } from "lucide-react";
import { isMuted, toggleMute } from "@/utils/audio";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

interface MysteryQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  evidence_type: "physical" | "testimony" | "forensic" | "background";
  evidence_item?: string;
  hint?: string;
}

interface Suspect {
  id: string;
  name: string;
  emoji: string;
  occupation: string;
  motive: string;
  alibi: string;
  personality: "nervous" | "confident" | "hostile" | "friendly" | "mysterious";
}

interface Evidence {
  id: string;
  name: string;
  type: "physical" | "testimony" | "forensic" | "background";
  description: string;
  emoji: string;
  suspectConnection?: string;
  isRedHerring?: boolean;
}

interface MysteryGameProps {
  gameData: { 
    questions: MysteryQuestion[];
    case_title?: string;
    victim_name?: string;
    location?: string;
    suspects?: Suspect[];
    culprit_id?: string;
  };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

type Phase = "briefing" | "investigation" | "interrogation" | "deduction" | "accusation" | "resolution" | "failure";
type InvestigationState = "searching" | "analyzing" | "interviewing" | "thinking";

const CASE_THEMES: GameTheme[] = ["neon", "arctic", "jungle"];
const QUESTION_TIME = 25;
const EVIDENCE_GOAL = 8; // Need to collect enough evidence to solve

const EVIDENCE_COLORS = {
  physical: { bg: "145, 65%, 45%", icon: Search, emoji: "🔍" },
  testimony: { bg: "210, 70%, 50%", icon: MessageSquare, emoji: "💬" },
  forensic: { bg: "280, 65%, 50%", icon: Fingerprint, emoji: "🧬" },
  background: { bg: "45, 85%, 50%", icon: Book, emoji: "📋" },
};

const SUSPECT_PERSONALITIES = {
  nervous: { traits: ["fidgets", "stutters", "avoids eye contact"], emoji: "😰" },
  confident: { traits: ["assertive", "direct", "maintains composure"], emoji: "😎" },
  hostile: { traits: ["defensive", "aggressive", "uncooperative"], emoji: "😠" },
  friendly: { traits: ["helpful", "talkative", "cooperative"], emoji: "😊" },
  mysterious: { traits: ["evasive", "cryptic", "secretive"], emoji: "🤐" },
};

// Default suspects if none provided
const DEFAULT_SUSPECTS: Suspect[] = [
  {
    id: "butler",
    name: "Charles Butler",
    emoji: "🤵",
    occupation: "House Butler", 
    motive: "Financial troubles",
    alibi: "Was serving tea in the kitchen",
    personality: "nervous"
  },
  {
    id: "spouse",
    name: "Victoria Smith",
    emoji: "👩‍💼",
    occupation: "Business Partner",
    motive: "Insurance money",
    alibi: "Was at the office meeting",
    personality: "confident"
  },
  {
    id: "rival",
    name: "Marcus Kane",
    emoji: "🕴️",
    occupation: "Business Rival",
    motive: "Corporate takeover",
    alibi: "Was golfing with clients",
    personality: "hostile"
  },
  {
    id: "friend",
    name: "Elena Rodriguez",
    emoji: "👩‍🔬",
    occupation: "Close Friend",
    motive: "Secret affair discovered",
    alibi: "Was working late at the lab",
    personality: "friendly"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE BOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function EvidenceBoard({ 
  evidence, 
  onSelectEvidence, 
  selectedEvidence 
}: { 
  evidence: Evidence[]; 
  onSelectEvidence: (evidence: Evidence) => void;
  selectedEvidence: Evidence | null;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-card/80 backdrop-blur rounded-2xl p-4 border-2 border-border">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Evidence Collected</h3>
          <span className="text-sm text-muted-foreground">({evidence.length}/{EVIDENCE_GOAL})</span>
        </div>
        
        {evidence.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No evidence collected yet. Answer questions correctly to gather clues!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {evidence.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onSelectEvidence(item)}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedEvidence?.id === item.id 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-muted/50 hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">{EVIDENCE_COLORS[item.type].emoji}</div>
                <div className="font-display font-bold text-xs text-foreground leading-tight">
                  {item.name}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">{item.type}</div>
                {item.isRedHerring && (
                  <div className="text-[10px] text-destructive">⚠️ Misleading</div>
                )}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Evidence details */}
        <AnimatePresence>
          {selectedEvidence && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-muted/30 rounded-xl border-l-4 border-primary"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{EVIDENCE_COLORS[selectedEvidence.type].emoji}</span>
                <h4 className="font-display font-bold text-foreground">{selectedEvidence.name}</h4>
                <span className="text-xs text-primary capitalize bg-primary/10 px-2 py-1 rounded-full">
                  {selectedEvidence.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedEvidence.description}</p>
              {selectedEvidence.suspectConnection && (
                <p className="text-xs text-game-orange mt-1">
                  🔗 Connected to: {selectedEvidence.suspectConnection}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUSPECT PROFILE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function SuspectProfile({ 
  suspect, 
  isBeingInterrogated, 
  evidence,
  onInterrogate 
}: { 
  suspect: Suspect; 
  isBeingInterrogated: boolean;
  evidence: Evidence[];
  onInterrogate: () => void;
}) {
  const personality = SUSPECT_PERSONALITIES[suspect.personality];
  const relatedEvidence = evidence.filter(e => e.suspectConnection === suspect.name);
  
  return (
    <motion.div
      layout
      className={`bg-card/80 backdrop-blur rounded-2xl p-4 border-2 transition-all ${
        isBeingInterrogated ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={isBeingInterrogated ? {
            scale: [1, 1.1, 1],
            rotate: [0, -2, 2, 0]
          } : {}}
          transition={{ duration: 2, repeat: isBeingInterrogated ? Infinity : 0 }}
          className="text-4xl"
        >
          {suspect.emoji}
        </motion.div>
        
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{suspect.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{suspect.occupation}</p>
          <div className="text-xs text-game-orange mb-2">
            Personality: {personality.traits.join(", ")} {personality.emoji}
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="text-xs">
              <span className="font-bold text-destructive">Motive:</span> {suspect.motive}
            </div>
            <div className="text-xs">
              <span className="font-bold text-game-blue">Alibi:</span> {suspect.alibi}
            </div>
          </div>
          
          {relatedEvidence.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-bold text-primary mb-1">Related Evidence:</div>
              {relatedEvidence.map(e => (
                <div key={e.id} className="text-xs text-muted-foreground">
                  {EVIDENCE_COLORS[e.type].emoji} {e.name}
                </div>
              ))}
            </div>
          )}
          
          <motion.button
            onClick={onInterrogate}
            disabled={isBeingInterrogated}
            whileHover={!isBeingInterrogated ? { scale: 1.02 } : {}}
            whileTap={!isBeingInterrogated ? { scale: 0.98 } : {}}
            className={`w-full py-2 px-4 rounded-xl font-display font-bold text-sm transition-all ${
              isBeingInterrogated
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            {isBeingInterrogated ? "🗣️ Questioning..." : "🎤 Interrogate"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MYSTERY DETECTIVE GAME
// ─────────────────────────────────────────────────────────────────────────────

export function MysteryDetectiveGame({ gameData, gameId, onExit, instructionLang = "en" }: MysteryGameProps) {
  const questions = gameData.questions;
  const caseTitle = gameData.case_title || "The Mysterious Case";
  const victimName = gameData.victim_name || "John Doe";
  const location = gameData.location || "Mansion Library";
  const suspects = gameData.suspects || DEFAULT_SUSPECTS;
  const culpritId = gameData.culprit_id || suspects[0]?.id;

  // Game state
  const [phase, setPhase] = useState<Phase>("briefing");
  const [investigationState, setInvestigationState] = useState<InvestigationState>("searching");
  const [theme] = useState(() => CASE_THEMES[Math.floor(Math.random() * CASE_THEMES.length)]);
  const [muted, setMuted] = useState(isMuted());
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Investigation state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [currentSuspect, setCurrentSuspect] = useState<Suspect | null>(null);
  const [interrogatedSuspects, setInterrogatedSuspects] = useState<Set<string>>(new Set());

  // Question state
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Final deduction
  const [accusedSuspect, setAccusedSuspect] = useState<Suspect | null>(null);
  const [deductionNotes, setDeductionNotes] = useState<string>("");

  // Scoring
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);

  // Effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [showEmojiBurst, setShowEmojiBurst] = useState(false);

  const currentQuestion = questions[questionIndex];
  const canMakeAccusation = evidence.length >= EVIDENCE_GOAL;
  const isSolved = phase === "resolution";

  // Question timer
  useEffect(() => {
    if (phase !== "investigation" && phase !== "interrogation") return;
    if (showResult) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (t <= 6) playTickSound();
        setTotalTime(prev => prev + 1);
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, showResult, questionIndex, currentSuspect]);

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    setShowResult(true);
    setIsCorrect(false);
    playIncorrectSound();
    setStreak(0);
    setShowFlash("incorrect");
    setTimeout(() => {
      setShowFlash(null);
      advanceInvestigation();
    }, 2000);
  }, [showResult]);

  const handleSelect = useCallback((option: string) => {
    if (showResult || selected) return;
    
    clearInterval(timerRef.current);
    setSelected(option);
    
    const correct = option === currentQuestion.correct_answer;
    setIsCorrect(correct);

    setTimeout(() => {
      setShowResult(true);

      if (correct) {
        playCorrectSound();
        const newStreak = streak + 1;
        setStreak(newStreak);
        setCorrectCount(c => c + 1);
        
        if (newStreak >= 2) playComboSound(newStreak);

        // Create evidence from correct answer
        const newEvidence: Evidence = {
          id: `evidence_${evidence.length + 1}`,
          name: currentQuestion.evidence_item || `Clue #${evidence.length + 1}`,
          type: currentQuestion.evidence_type,
          description: `Discovered through investigation: ${currentQuestion.correct_answer}`,
          emoji: EVIDENCE_COLORS[currentQuestion.evidence_type].emoji,
          suspectConnection: currentSuspect?.name,
          isRedHerring: Math.random() < 0.15, // 15% chance of red herring
        };
        
        setEvidence(prev => [...prev, newEvidence]);
        
        // Score with bonuses
        const timeBonus = Math.round((timeLeft / QUESTION_TIME) * 50);
        const streakBonus = Math.min(newStreak - 1, 5) * 25;
        setScore(s => s + 100 + timeBonus + streakBonus);

        setShowConfetti(true);
        setShowFlash("correct");
        speak(currentQuestion.correct_answer);
        
        setTimeout(() => {
          setShowConfetti(false);
          setShowFlash(null);
        }, 1000);
      } else {
        playIncorrectSound();
        setStreak(0);
        setShowFlash("incorrect");
        setTimeout(() => setShowFlash(null), 500);
      }

      setTimeout(() => advanceInvestigation(), 2500);
    }, 600);
  }, [showResult, selected, currentQuestion, streak, timeLeft, currentSuspect, evidence]);

  const advanceInvestigation = useCallback(() => {
    // Check if we've exhausted questions or reached evidence goal
    if (questionIndex + 1 >= questions.length || evidence.length >= EVIDENCE_GOAL) {
      setPhase("deduction");
      return;
    }

    setQuestionIndex(q => q + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME);
    setShowHint(false);

    // Randomly switch between searching scenes and interrogating suspects
    if (Math.random() < 0.4 && interrogatedSuspects.size < suspects.length) {
      const availableSuspects = suspects.filter(s => !interrogatedSuspects.has(s.id));
      if (availableSuspects.length > 0) {
        const suspect = availableSuspects[Math.floor(Math.random() * availableSuspects.length)];
        setCurrentSuspect(suspect);
        setInvestigationState("interviewing");
        setInterrogatedSuspects(prev => new Set([...prev, suspect.id]));
      } else {
        setCurrentSuspect(null);
        setInvestigationState("searching");
      }
    } else {
      setCurrentSuspect(null);
      setInvestigationState("searching");
    }
  }, [questionIndex, questions.length, evidence.length, interrogatedSuspects, suspects]);

  const makeAccusation = (suspect: Suspect) => {
    setAccusedSuspect(suspect);
    setPhase("accusation");
    
    setTimeout(() => {
      if (suspect.id === culpritId) {
        // Correct accusation!
        setPhase("resolution");
        playCompleteSound();
        setShowEmojiBurst(true);
        setScore(s => s + 500); // Big bonus for solving correctly
      } else {
        // Wrong accusation
        setPhase("failure");
        playIncorrectSound();
      }
    }, 2000);
  };

  const startInvestigation = () => {
    setPhase("investigation");
    setTimeLeft(QUESTION_TIME);
  };

  const resetGame = () => {
    setPhase("briefing");
    setInvestigationState("searching");
    setQuestionIndex(0);
    setEvidence([]);
    setSelectedEvidence(null);
    setCurrentSuspect(null);
    setInterrogatedSuspects(new Set());
    setSelected(null);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME);
    setShowHint(false);
    setAccusedSuspect(null);
    setDeductionNotes("");
    setScore(0);
    setCorrectCount(0);
    setTotalTime(0);
    setStreak(0);
  };

  // ─── RENDER: BRIEFING ─────────────────────────────────────────────────────
  if (phase === "briefing") {
    return (
      <ThemedBackground theme={theme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-lg"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🕵️
            </motion.div>
            
            <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
              MYSTERY DETECTIVE
            </h1>
            <h2 className="font-display text-xl md:text-2xl font-bold text-primary mb-4">
              {caseTitle}
            </h2>
            
            <div className="bg-black/30 backdrop-blur rounded-2xl p-6 mb-6 border border-white/20">
              <h3 className="font-display text-lg font-bold text-white mb-3">📋 Case Briefing</h3>
              <div className="text-left space-y-2 text-sm text-white/80">
                <p><span className="font-bold">Victim:</span> {victimName}</p>
                <p><span className="font-bold">Location:</span> {location}</p>
                <p><span className="font-bold">Suspects:</span> {suspects.length} individuals</p>
                <p><span className="font-bold">Evidence Needed:</span> {EVIDENCE_GOAL} pieces</p>
              </div>
            </div>
            
            <p className="text-white/70 font-body text-sm mb-8">
              Investigate the crime scene, interrogate suspects, and gather evidence. 
              Then make your accusation to solve the case!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startInvestigation}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-game-blue text-white font-display font-black text-xl shadow-2xl border-2 border-white/20"
            >
              🔍 Start Investigation
            </motion.button>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: DEDUCTION ────────────────────────────────────────────────────
  if (phase === "deduction") {
    return (
      <ThemedBackground theme={theme}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🧠
              </motion.div>
              <h2 className="font-display text-3xl font-black text-white mb-2">Time to Solve</h2>
              <p className="text-white/70">Review your evidence and make an accusation</p>
            </div>

            <EvidenceBoard 
              evidence={evidence} 
              onSelectEvidence={setSelectedEvidence}
              selectedEvidence={selectedEvidence}
            />

            <div className="grid md:grid-cols-2 gap-4">
              {suspects.map((suspect) => (
                <SuspectProfile
                  key={suspect.id}
                  suspect={suspect}
                  isBeingInterrogated={false}
                  evidence={evidence}
                  onInterrogate={() => makeAccusation(suspect)}
                />
              ))}
            </div>

            <div className="text-center mt-6">
              <p className="text-white/60 text-sm mb-4">
                Who do you think committed the crime? Choose carefully!
              </p>
            </div>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: ACCUSATION ───────────────────────────────────────────────────
  if (phase === "accusation") {
    return (
      <ThemedBackground theme={theme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              ⚖️
            </motion.div>
            <h2 className="font-display text-3xl font-black text-white mb-4">
              ACCUSATION MADE
            </h2>
            <div className="bg-black/30 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-3">{accusedSuspect?.emoji}</div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">
                {accusedSuspect?.name}
              </h3>
              <p className="text-white/70 text-sm">
                Revealing the truth...
              </p>
            </div>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: RESOLUTION ───────────────────────────────────────────────────
  if (phase === "resolution") {
    return (
      <GameComplete
        score={score}
        correctCount={correctCount}
        totalQuestions={questions.length}
        timeElapsed={totalTime}
        gameId={gameId}
        onPlayAgain={resetGame}
        onExit={onExit}
        instructionLang={instructionLang}
      />
    );
  }

  // ─── RENDER: FAILURE ──────────────────────────────────────────────────────
  if (phase === "failure") {
    const realCulprit = suspects.find(s => s.id === culpritId);
    return (
      <ThemedBackground theme={theme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-lg"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              ❌
            </motion.div>
            <h2 className="font-display text-3xl font-black text-destructive mb-4">
              CASE UNSOLVED
            </h2>
            <div className="bg-black/30 backdrop-blur rounded-2xl p-6 mb-6 border border-destructive/30">
              <p className="text-white/70 mb-4">
                Wrong accusation! The real culprit was...
              </p>
              <div className="text-4xl mb-2">{realCulprit?.emoji}</div>
              <h3 className="font-display text-xl font-bold text-primary">
                {realCulprit?.name}
              </h3>
              <p className="text-sm text-white/60 mt-2">{realCulprit?.motive}</p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-6 py-3 rounded-xl bg-primary text-white font-display font-bold"
              >
                🔄 Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExit}
                className="px-6 py-3 rounded-xl bg-muted text-foreground font-display font-bold"
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: INVESTIGATION ────────────────────────────────────────────────
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerCritical = timeLeft <= 5;
  const timerWarning = timeLeft <= 10;

  return (
    <ThemedBackground theme={theme}>
      <div className="min-h-screen flex flex-col relative">
        {/* Effects */}
        {showConfetti && <ConfettiBurst count={25} />}
        {showFlash && <ScreenFlash type={showFlash} />}
        {showEmojiBurst && <EmojiBurst emoji="🏆" count={8} />}

        {/* Quit confirmation */}
        <AnimatePresence>
          {showQuitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowQuitConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 border border-border max-w-sm w-full text-center"
              >
                <div className="text-5xl mb-3">🚪</div>
                <h3 className="font-display text-xl font-black text-foreground mb-2">Close Case?</h3>
                <p className="text-sm text-muted-foreground mb-5">Your investigation progress will be lost.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuitConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-muted text-foreground"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => { setShowQuitConfirm(false); onExit(); }}
                    className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-destructive text-white"
                  >
                    Close Case
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top HUD */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white/80 text-sm">
              {investigationState === "interviewing" ? "🎤 Interrogation" : "🔍 Investigation"}
            </span>
            <span className="text-xs text-white/50">
              Q{questionIndex + 1}/{questions.length}
            </span>
            <span className="text-xs text-primary">
              Evidence: {evidence.length}/{EVIDENCE_GOAL}
            </span>
          </div>
          
          <motion.span
            animate={timerCritical ? { scale: [1, 1.2, 1], color: ["#f00", "#ff6666", "#f00"] } : {}}
            transition={timerCritical ? { duration: 0.5, repeat: Infinity } : {}}
            className="font-mono font-bold text-lg text-white"
          >
            0:{timeLeft.toString().padStart(2, "0")}
          </motion.span>

          <div className="flex items-center gap-2">
            {canMakeAccusation && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setPhase("deduction")}
                className="px-3 py-1.5 rounded-lg bg-primary text-white font-display font-bold text-sm"
              >
                ⚖️ Solve Case
              </motion.button>
            )}
            <button
              onClick={() => { const m = toggleMute(); setMuted(m); }}
              className="p-1.5 rounded-lg hover:bg-white/10"
            >
              {muted ? <VolumeX className="h-4 w-4 text-white/50" /> : <Volume2 className="h-4 w-4 text-white/50" />}
            </button>
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="h-4 w-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-1.5 bg-white/10">
          <motion.div
            className="h-full"
            animate={{ width: `${timerPct}%` }}
            style={{
              backgroundColor: timerCritical ? "hsl(0, 80%, 55%)" : timerWarning ? "hsl(45, 90%, 50%)" : "hsl(210, 70%, 55%)"
            }}
          />
        </div>

        {/* Evidence board */}
        <div className="p-4">
          <EvidenceBoard 
            evidence={evidence} 
            onSelectEvidence={setSelectedEvidence}
            selectedEvidence={selectedEvidence}
          />
        </div>

        {/* Current context */}
        <div className="px-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur rounded-2xl p-4 border border-white/20"
          >
            {investigationState === "interviewing" && currentSuspect ? (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{currentSuspect.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-white">Interrogating {currentSuspect.name}</h3>
                  <p className="text-xs text-white/60">{currentSuspect.occupation} • {SUSPECT_PERSONALITIES[currentSuspect.personality].traits.join(", ")}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-white">Investigating {location}</h3>
              </div>
            )}
          </motion.div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-6"
              >
                <SpeakableText text={currentQuestion.question}>
                  <h2 className="font-display text-xl md:text-2xl font-black text-white leading-tight">
                    {currentQuestion.question}
                  </h2>
                </SpeakableText>
                
                <div className="mt-2 text-xs text-primary">
                  Looking for: {EVIDENCE_COLORS[currentQuestion.evidence_type].emoji} {currentQuestion.evidence_type} evidence
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selected === option;
                const isAnswer = option === currentQuestion.correct_answer;
                const isLocked = selected !== null;

                const colors = ["210, 70%, 50%", "0, 72%, 50%", "45, 90%, 48%", "145, 60%, 40%"];
                const color = colors[i % colors.length];

                let cardBg = `hsl(${color})`;
                let cardOpacity = 1;
                let cardScale = 1;
                let border = "none";

                if (showResult) {
                  if (isAnswer) {
                    cardBg = "hsl(145, 65%, 45%)";
                    border = "3px solid hsl(145, 80%, 60%)";
                    cardScale = 1.05;
                  } else if (isSelected && !isAnswer) {
                    cardBg = "hsl(0, 70%, 45%)";
                    border = "3px solid hsl(0, 80%, 60%)";
                  } else {
                    cardOpacity = 0.2;
                  }
                } else if (isSelected) {
                  cardScale = 0.97;
                }

                return (
                  <SpeakableText key={option} text={option} speakOnHover={!isLocked}>
                    <motion.button
                      onClick={() => handleSelect(option)}
                      disabled={isLocked}
                      animate={{
                        opacity: cardOpacity,
                        scale: showResult && isAnswer ? [1, 1.08, 1.05] : cardScale,
                      }}
                      whileHover={!isLocked ? { scale: 1.04, y: -3 } : {}}
                      whileTap={!isLocked ? { scale: 0.96 } : {}}
                      style={{
                        backgroundColor: cardBg,
                        border,
                        boxShadow: `0 6px 0 hsl(${color.split(",")[0]}, ${color.split(",")[1]}, 25%), 0 8px 20px rgba(0,0,0,0.3)`,
                      }}
                      className="w-full text-white font-display font-black text-base sm:text-lg p-4 sm:p-5 rounded-xl text-center relative overflow-hidden cursor-pointer disabled:cursor-default select-none"
                    >
                      <span className="relative z-10">{option}</span>
                      
                      {showResult && isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-3 text-xl"
                        >
                          ✓
                        </motion.span>
                      )}
                      {showResult && isSelected && !isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-3 text-xl"
                        >
                          ✗
                        </motion.span>
                      )}
                    </motion.button>
                  </SpeakableText>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
}