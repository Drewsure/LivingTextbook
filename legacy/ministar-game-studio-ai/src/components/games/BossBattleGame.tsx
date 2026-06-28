import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay, EmojiBurst } from "./effects/Particles";
import { ThemedBackground, getRandomTheme, GameTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playTickSound, playPowerUpSound, playLevelUpSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { X, Volume2, VolumeX, Shield, Sword, Heart, Zap, Target, Crown, Flame, Star, Sparkles, Clock, SkipForward, Eye } from "lucide-react";
import { isMuted, toggleMute } from "@/utils/audio";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

interface BossQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  hint?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface BossBattleGameProps {
  gameData: { 
    questions: BossQuestion[];
    boss_name?: string;
    boss_emoji?: string;
  };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

type Phase = "intro" | "battle" | "phase_transition" | "boss_defeat" | "player_defeat" | "victory";
type BossState = "idle" | "attack" | "hurt" | "charge" | "enraged" | "defeated";

const BOSS_PHASES = [
  { name: "Phase 1", hpMultiplier: 1, theme: "volcano" as GameTheme, emoji: "👹", title: "The Awakening" },
  { name: "Phase 2", hpMultiplier: 1, theme: "neon" as GameTheme, emoji: "😈", title: "Rising Fury" },
  { name: "Phase 3", hpMultiplier: 1, theme: "space" as GameTheme, emoji: "💀", title: "Final Form" },
];

const QUESTION_TIME = 15;
const PLAYER_MAX_HP = 100;
const BOSS_HP_PER_QUESTION = 25;

const ANSWER_COLORS = [
  { bg: "210, 70%, 50%", glow: "210, 80%, 60%", label: "A" },
  { bg: "0, 72%, 50%", glow: "0, 80%, 60%", label: "B" },
  { bg: "45, 90%, 48%", glow: "45, 95%, 58%", label: "C" },
  { bg: "145, 60%, 40%", glow: "145, 70%, 50%", label: "D" },
];

const POWER_UPS = [
  { id: "shield", icon: Shield, label: "Shield", emoji: "🛡️", color: "210, 80%, 55%" },
  { id: "double", icon: Sword, label: "2x DMG", emoji: "⚔️", color: "0, 75%, 55%" },
  { id: "time", icon: Clock, label: "+10s", emoji: "⏰", color: "145, 65%, 45%" },
  { id: "hint", icon: Eye, label: "Hint", emoji: "👁️", color: "280, 70%, 55%" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BOSS AVATAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function BossAvatar({ 
  state, 
  phaseIndex, 
  hp, 
  maxHp,
  emoji,
  isEnraged 
}: { 
  state: BossState; 
  phaseIndex: number; 
  hp: number; 
  maxHp: number;
  emoji: string;
  isEnraged: boolean;
}) {
  const controls = useAnimation();
  const hpPercent = Math.max(0, (hp / maxHp) * 100);

  useEffect(() => {
    switch (state) {
      case "attack":
        controls.start({
          scale: [1, 1.3, 0.9, 1.1, 1],
          rotate: [0, -15, 15, -10, 0],
          transition: { duration: 0.6 }
        });
        break;
      case "hurt":
        controls.start({
          x: [0, -30, 30, -20, 20, -10, 0],
          scale: [1, 0.85, 1],
          filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
          transition: { duration: 0.5 }
        });
        break;
      case "charge":
        controls.start({
          scale: [1, 1.1, 1, 1.15, 1],
          rotate: [0, 5, -5, 5, 0],
          transition: { duration: 1, repeat: Infinity }
        });
        break;
      case "defeated":
        controls.start({
          scale: [1, 0.5, 0],
          rotate: [0, 720],
          opacity: [1, 1, 0],
          transition: { duration: 1.5 }
        });
        break;
      default:
        controls.start({
          y: [0, -8, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        });
    }
  }, [state, controls]);

  return (
    <div className="relative">
      {/* Enraged aura */}
      <AnimatePresence>
        {isEnraged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-radial from-destructive/50 to-transparent rounded-full blur-2xl"
            style={{ width: "200%", height: "200%", left: "-50%", top: "-50%" }}
          />
        )}
      </AnimatePresence>

      {/* Boss emoji */}
      <motion.div
        animate={controls}
        className="relative z-10"
      >
        <span className="text-7xl md:text-9xl filter drop-shadow-2xl cursor-default select-none">
          {emoji}
        </span>
        
        {/* Damage numbers floating */}
        <AnimatePresence>
          {state === "hurt" && (
            <motion.div
              initial={{ opacity: 1, y: 0, x: 30, scale: 0.5 }}
              animate={{ opacity: 0, y: -60, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute -top-4 right-0 font-display font-black text-2xl text-game-orange"
            >
              -{BOSS_HP_PER_QUESTION}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* HP Bar */}
      <div className="mt-4 w-48 mx-auto">
        <div className="flex justify-between text-xs font-display font-bold text-white/80 mb-1">
          <span>BOSS HP</span>
          <span>{Math.round(hp)} / {maxHp}</span>
        </div>
        <div className="h-4 bg-black/40 rounded-full overflow-hidden border-2 border-white/20">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: hpPercent > 60 
                ? "linear-gradient(90deg, hsl(145, 70%, 45%), hsl(145, 80%, 55%))"
                : hpPercent > 30 
                  ? "linear-gradient(90deg, hsl(45, 90%, 50%), hsl(45, 100%, 60%))"
                  : "linear-gradient(90deg, hsl(0, 70%, 50%), hsl(0, 80%, 60%))"
            }}
            initial={{ width: "100%" }}
            animate={{ width: `${hpPercent}%` }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="mt-2 flex justify-center gap-1">
        {BOSS_PHASES.map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full border-2 ${
              i < phaseIndex ? "bg-game-green border-game-green" :
              i === phaseIndex ? "bg-primary border-primary" :
              "bg-transparent border-white/30"
            }`}
            animate={i === phaseIndex ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER HUD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function PlayerHUD({ 
  hp, 
  maxHp, 
  streak, 
  combo,
  hasShield 
}: { 
  hp: number; 
  maxHp: number; 
  streak: number;
  combo: number;
  hasShield: boolean;
}) {
  const hpPercent = (hp / maxHp) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        {/* Player avatar */}
        <motion.div
          animate={hasShield ? { 
            boxShadow: ["0 0 20px hsl(210, 80%, 55%)", "0 0 40px hsl(210, 80%, 55%)", "0 0 20px hsl(210, 80%, 55%)"]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="relative"
        >
          <span className="text-4xl">🧙</span>
          {hasShield && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 text-lg"
            >
              🛡️
            </motion.span>
          )}
        </motion.div>

        {/* HP bar */}
        <div className="flex-1">
          <div className="flex justify-between text-xs font-display font-bold text-white/80 mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-destructive" /> YOUR HP
            </span>
            <span>{Math.round(hp)} / {maxHp}</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/20">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: hpPercent > 60 
                  ? "linear-gradient(90deg, hsl(145, 70%, 45%), hsl(145, 80%, 55%))"
                  : hpPercent > 30 
                    ? "linear-gradient(90deg, hsl(45, 90%, 50%), hsl(45, 100%, 60%))"
                    : "linear-gradient(90deg, hsl(0, 70%, 50%), hsl(0, 80%, 60%))"
              }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ type: "spring", damping: 15 }}
            />
          </div>
        </div>

        {/* Streak/Combo */}
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 20 }}
              className="flex flex-col items-center bg-game-orange/20 rounded-xl px-3 py-1 border border-game-orange/40"
            >
              <span className="text-lg">🔥</span>
              <span className="font-display font-black text-sm text-game-orange">{streak}x</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POWER-UP BAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function PowerUpBar({
  powerUps,
  onUsePowerUp,
  disabled,
}: {
  powerUps: Record<string, number>;
  onUsePowerUp: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {POWER_UPS.map(({ id, icon: Icon, label, emoji, color }) => {
        const count = powerUps[id] || 0;
        const isDisabled = disabled || count === 0;
        
        return (
          <motion.button
            key={id}
            onClick={() => !isDisabled && onUsePowerUp(id)}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.1, y: -3 } : {}}
            whileTap={!isDisabled ? { scale: 0.9 } : {}}
            className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all"
            style={{
              backgroundColor: isDisabled ? "hsl(var(--muted))" : `hsl(${color} / 0.15)`,
              borderColor: isDisabled ? "hsl(var(--border))" : `hsl(${color})`,
              opacity: isDisabled ? 0.4 : 1,
              cursor: isDisabled ? "default" : "pointer",
            }}
          >
            <span className="text-lg">{emoji}</span>
            <span 
              className="text-[10px] font-display font-bold"
              style={{ color: isDisabled ? "hsl(var(--muted-foreground))" : `hsl(${color})` }}
            >
              {label}
            </span>
            <motion.span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: count > 0 ? `hsl(${color})` : "hsl(var(--muted-foreground))" }}
            >
              {count}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BOSS BATTLE GAME
// ─────────────────────────────────────────────────────────────────────────────

export function BossBattleGame({ gameData, gameId, onExit, instructionLang = "en" }: BossBattleGameProps) {
  const questions = gameData.questions;
  const bossName = gameData.boss_name || "The Knowledge Guardian";
  const bossEmoji = gameData.boss_emoji || "👹";

  // Game state
  const [phase, setPhase] = useState<Phase>("intro");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [muted, setMuted] = useState(isMuted());
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Combat state
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(0);
  const [bossState, setBossState] = useState<BossState>("idle");
  const [isEnraged, setIsEnraged] = useState(false);

  // Question state
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  // Effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [showEmojiBurst, setShowEmojiBurst] = useState(false);

  // Power-ups
  const [powerUps, setPowerUps] = useState<Record<string, number>>({
    shield: 1,
    double: 1,
    time: 1,
    hint: 1,
  });
  const [hasShield, setHasShield] = useState(false);
  const [hasDamageBoost, setHasDamageBoost] = useState(false);

  // Theme based on phase
  const currentTheme = BOSS_PHASES[phaseIndex]?.theme || "volcano";
  const currentPhaseEmoji = BOSS_PHASES[phaseIndex]?.emoji || bossEmoji;
  
  // Questions per phase
  const questionsPerPhase = Math.ceil(questions.length / 3);
  const phaseStartIndex = phaseIndex * questionsPerPhase;
  const phaseEndIndex = Math.min(phaseStartIndex + questionsPerPhase, questions.length);
  const currentQuestion = questions[questionIndex];

  // Initialize boss HP for current phase
  useEffect(() => {
    const phaseQuestionCount = phaseEndIndex - phaseStartIndex;
    const maxHp = phaseQuestionCount * BOSS_HP_PER_QUESTION;
    setBossMaxHp(maxHp);
    setBossHp(maxHp);
    setIsEnraged(false);
  }, [phaseIndex, phaseStartIndex, phaseEndIndex]);

  // Check for enraged state
  useEffect(() => {
    if (bossHp > 0 && bossHp < bossMaxHp * 0.3 && !isEnraged) {
      setIsEnraged(true);
      setBossState("charge");
      setTimeout(() => setBossState("idle"), 1500);
    }
  }, [bossHp, bossMaxHp, isEnraged]);

  // Question timer
  useEffect(() => {
    if (phase !== "battle" || showResult) return;
    
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
  }, [phase, showResult, questionIndex]);

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    setShowResult(true);
    setIsCorrect(false);
    
    // Boss attacks!
    setBossState("attack");
    playIncorrectSound();
    setStreak(0);
    setComboMultiplier(1);
    setShowFlash("incorrect");

    if (!hasShield) {
      const damage = isEnraged ? 30 : 20;
      setPlayerHp(prev => Math.max(0, prev - damage));
    } else {
      setHasShield(false);
    }

    setTimeout(() => {
      setBossState("idle");
      setShowFlash(null);
      advanceQuestion();
    }, 2000);
  }, [showResult, hasShield, isEnraged]);

  const handleSelect = useCallback((option: string) => {
    if (showResult || selected || phase !== "battle") return;
    
    clearInterval(timerRef.current);
    setSelected(option);
    
    const correct = option === currentQuestion.correct_answer;
    setIsCorrect(correct);

    // Suspense delay
    setTimeout(() => {
      setShowResult(true);

      if (correct) {
        // Attack boss!
        setBossState("hurt");
        playCorrectSound();
        
        const newStreak = streak + 1;
        setStreak(newStreak);
        setCorrectCount(c => c + 1);
        
        if (newStreak >= 2) {
          playComboSound(newStreak);
          setComboMultiplier(Math.min(newStreak, 5));
        }

        // Calculate damage
        let damage = BOSS_HP_PER_QUESTION;
        if (hasDamageBoost) {
          damage *= 2;
          setHasDamageBoost(false);
        }
        damage += Math.min(newStreak - 1, 4) * 5; // Streak bonus

        setBossHp(prev => Math.max(0, prev - damage));
        
        // Points
        const timeBonus = Math.round((timeLeft / QUESTION_TIME) * 50);
        const streakBonus = Math.min(newStreak - 1, 5) * 50;
        setScore(s => s + 100 + timeBonus + streakBonus);

        setShowConfetti(true);
        setShowFlash("correct");
        speak(currentQuestion.correct_answer);
        
        setTimeout(() => {
          setShowConfetti(false);
          setShowFlash(null);
          setBossState("idle");
        }, 1000);

      } else {
        // Boss attacks!
        setBossState("attack");
        playIncorrectSound();
        setStreak(0);
        setComboMultiplier(1);
        setShowFlash("incorrect");

        if (!hasShield) {
          const damage = isEnraged ? 30 : 20;
          setPlayerHp(prev => Math.max(0, prev - damage));
        } else {
          setHasShield(false);
        }

        setTimeout(() => {
          setBossState("idle");
          setShowFlash(null);
        }, 800);
      }

      setTimeout(() => advanceQuestion(), 2000);
    }, 600);
  }, [showResult, selected, phase, currentQuestion, streak, timeLeft, hasDamageBoost, hasShield, isEnraged]);

  const advanceQuestion = useCallback(() => {
    // Check for boss defeat (phase complete)
    if (bossHp <= 0) {
      if (phaseIndex >= BOSS_PHASES.length - 1 || questionIndex >= questions.length - 1) {
        // Final victory!
        setPhase("victory");
        playLevelUpSound();
        setShowEmojiBurst(true);
        return;
      } else {
        // Next phase
        setPhase("phase_transition");
        playPowerUpSound();
        setTimeout(() => {
          setPhaseIndex(p => p + 1);
          setPhase("battle");
        }, 3000);
        return;
      }
    }

    // Check player defeat
    if (playerHp <= 0) {
      setPhase("player_defeat");
      return;
    }

    // Next question
    if (questionIndex + 1 >= questions.length) {
      // Ran out of questions but boss not dead - victory by survival
      setPhase("victory");
      playLevelUpSound();
      return;
    }

    setQuestionIndex(q => q + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME);
    setShowHint(false);
    setEliminatedOptions(new Set());
  }, [bossHp, playerHp, phaseIndex, questionIndex, questions.length]);

  const handleUsePowerUp = useCallback((id: string) => {
    if (powerUps[id] <= 0 || showResult) return;
    
    setPowerUps(prev => ({ ...prev, [id]: prev[id] - 1 }));
    playPowerUpSound();

    switch (id) {
      case "shield":
        setHasShield(true);
        break;
      case "double":
        setHasDamageBoost(true);
        break;
      case "time":
        setTimeLeft(t => Math.min(t + 10, QUESTION_TIME + 10));
        break;
      case "hint":
        if (currentQuestion.hint) {
          setShowHint(true);
        } else {
          // Eliminate 2 wrong answers
          const wrongOptions = currentQuestion.options.filter(o => o !== currentQuestion.correct_answer);
          const toEliminate = wrongOptions.slice(0, 2);
          setEliminatedOptions(new Set(toEliminate));
        }
        break;
    }
  }, [powerUps, showResult, currentQuestion]);

  const startBattle = () => {
    setPhase("battle");
    setTimeLeft(QUESTION_TIME);
  };

  const resetGame = () => {
    setPhase("intro");
    setPhaseIndex(0);
    setQuestionIndex(0);
    setPlayerHp(PLAYER_MAX_HP);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalTime(0);
    setComboMultiplier(1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME);
    setShowHint(false);
    setEliminatedOptions(new Set());
    setPowerUps({ shield: 1, double: 1, time: 1, hint: 1 });
    setHasShield(false);
    setHasDamageBoost(false);
    setBossState("idle");
    setIsEnraged(false);
  };

  // ─── RENDER: INTRO ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <ThemedBackground theme={currentTheme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl md:text-[120px] mb-6 filter drop-shadow-2xl"
            >
              {bossEmoji}
            </motion.div>
            
            <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
              BOSS BATTLE
            </h1>
            <h2 className="font-display text-xl md:text-2xl font-bold text-primary mb-4">
              {bossName}
            </h2>
            
            <p className="text-white/70 font-body text-sm mb-2">
              Answer questions to deal damage. Wrong answers = Boss attacks!
            </p>
            <p className="text-white/50 font-body text-xs mb-8">
              {questions.length} questions · 3 phases · Use power-ups wisely!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startBattle}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-game-purple text-white font-display font-black text-xl shadow-2xl border-2 border-white/20"
            >
              ⚔️ Begin Battle!
            </motion.button>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: PHASE TRANSITION ──────────────────────────────────────────────
  if (phase === "phase_transition") {
    const nextPhase = BOSS_PHASES[phaseIndex + 1];
    return (
      <ThemedBackground theme={currentTheme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <ConfettiBurst count={50} duration={2} />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 10 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              ⚡
            </motion.div>
            <h2 className="font-display text-3xl font-black text-white mb-2">
              PHASE COMPLETE!
            </h2>
            <p className="font-display text-xl text-primary mb-4">
              {nextPhase?.title || "Final Phase"} Incoming...
            </p>
            <div className="flex justify-center gap-2">
              {BOSS_PHASES.map((p, i) => (
                <div
                  key={i}
                  className={`text-3xl transition-all ${i <= phaseIndex ? "opacity-100 scale-110" : "opacity-30"}`}
                >
                  {p.emoji}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  // ─── RENDER: VICTORY ───────────────────────────────────────────────────────
  if (phase === "victory") {
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

  // ─── RENDER: PLAYER DEFEAT ─────────────────────────────────────────────────
  if (phase === "player_defeat") {
    return (
      <ThemedBackground theme={currentTheme}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              💀
            </motion.div>
            <h2 className="font-display text-3xl font-black text-destructive mb-2">
              DEFEATED!
            </h2>
            <p className="text-white/70 mb-6">
              The boss was too powerful... But every defeat makes you stronger!
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-6 py-3 rounded-xl bg-primary text-white font-display font-bold"
              >
                Try Again
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

  // ─── RENDER: BATTLE ────────────────────────────────────────────────────────
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerCritical = timeLeft <= 5;
  const timerWarning = timeLeft <= 10;

  return (
    <ThemedBackground theme={currentTheme}>
      <div className="min-h-screen flex flex-col relative">
        {/* Effects */}
        <AnimatePresence>
          {phase === "battle" && !showResult && (
            <CountdownOverlay onComplete={() => {}} />
          )}
        </AnimatePresence>
        {showConfetti && <ConfettiBurst count={30} duration={1.2} />}
        {showFlash && <ScreenFlash type={showFlash} />}
        {showEmojiBurst && <EmojiBurst emoji="🏆" count={12} />}

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
                <h3 className="font-display text-xl font-black text-foreground mb-2">Retreat?</h3>
                <p className="text-sm text-muted-foreground mb-5">Your progress will be lost.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuitConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-muted text-foreground"
                  >
                    Stay
                  </button>
                  <button
                    onClick={() => { setShowQuitConfirm(false); onExit(); }}
                    className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-destructive text-white"
                  >
                    Retreat
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
              {BOSS_PHASES[phaseIndex]?.name}
            </span>
            <span className="text-xs text-white/50">
              Q{questionIndex + 1}/{questions.length}
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

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 pt-2">
          {/* Boss */}
          <div className="mb-6">
            <BossAvatar
              state={bossState}
              phaseIndex={phaseIndex}
              hp={bossHp}
              maxHp={bossMaxHp}
              emoji={currentPhaseEmoji}
              isEnraged={isEnraged}
            />
          </div>

          {/* Vs divider */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl mb-4"
          >
            ⚔️
          </motion.div>

          {/* Player HUD */}
          <PlayerHUD
            hp={playerHp}
            maxHp={PLAYER_MAX_HP}
            streak={streak}
            combo={comboMultiplier}
            hasShield={hasShield}
          />

          {/* Power-ups */}
          <div className="mt-4 mb-4">
            <PowerUpBar
              powerUps={powerUps}
              onUsePowerUp={handleUsePowerUp}
              disabled={showResult}
            />
          </div>

          {/* Question */}
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

                {/* Hint */}
                <AnimatePresence>
                  {showHint && currentQuestion.hint && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-primary font-body"
                    >
                      💡 {currentQuestion.hint}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Active effects */}
            <div className="flex justify-center gap-2 mb-4">
              <AnimatePresence>
                {hasShield && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    🛡️ Shield Active
                  </motion.div>
                )}
                {hasDamageBoost && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1 bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    ⚔️ 2x Damage
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, i) => {
                const color = ANSWER_COLORS[i % ANSWER_COLORS.length];
                const isSelected = selected === option;
                const isAnswer = option === currentQuestion.correct_answer;
                const isEliminated = eliminatedOptions.has(option);
                const isLocked = selected !== null;

                let cardBg = `hsl(${color.bg})`;
                let cardOpacity = 1;
                let cardScale = 1;
                let border = "none";

                if (isEliminated && !showResult) {
                  cardOpacity = 0.25;
                }

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
                      onClick={() => !isEliminated && handleSelect(option)}
                      disabled={isLocked || isEliminated}
                      animate={{
                        opacity: cardOpacity,
                        scale: showResult && isAnswer ? [1, 1.08, 1.05] : cardScale,
                      }}
                      whileHover={!isLocked && !isEliminated ? { scale: 1.04, y: -3 } : {}}
                      whileTap={!isLocked && !isEliminated ? { scale: 0.96 } : {}}
                      style={{
                        backgroundColor: cardBg,
                        border,
                        boxShadow: `0 6px 0 hsl(${color.bg.split(",")[0]}, ${color.bg.split(",")[1]}, 25%), 0 8px 20px rgba(0,0,0,0.3)`,
                      }}
                      className="w-full text-white font-display font-black text-base sm:text-lg p-4 sm:p-5 rounded-xl text-center relative overflow-hidden cursor-pointer disabled:cursor-default select-none"
                    >
                      <span className="absolute top-2 left-3 text-xs opacity-60">
                        {color.label}
                      </span>
                      <span className="relative z-10 block pt-1">{option}</span>
                      
                      {showResult && isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-3 text-lg"
                        >
                          ✓
                        </motion.span>
                      )}
                      {showResult && isSelected && !isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-3 text-lg"
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
