import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, SkipForward, Eye, Clock } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PowerUpType = "fifty_fifty" | "skip" | "hint" | "extra_time";

interface PowerUpConfig {
  icon: React.ReactNode;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const POWER_UP_CONFIG: Record<PowerUpType, PowerUpConfig> = {
  fifty_fifty: {
    icon: <Zap className="h-5 w-5" />,
    label: "50/50",
    emoji: "⚡",
    color: "hsl(262, 83%, 58%)",
    bgColor: "hsl(262, 83%, 58%, 0.15)",
  },
  skip: {
    icon: <SkipForward className="h-5 w-5" />,
    label: "Skip",
    emoji: "⏭️",
    color: "hsl(210, 100%, 56%)",
    bgColor: "hsl(210, 100%, 56%, 0.15)",
  },
  hint: {
    icon: <Eye className="h-5 w-5" />,
    label: "Hint",
    emoji: "👁️",
    color: "hsl(28, 100%, 53%)",
    bgColor: "hsl(28, 100%, 53%, 0.15)",
  },
  extra_time: {
    icon: <Clock className="h-5 w-5" />,
    label: "+10s",
    emoji: "⏰",
    color: "hsl(145, 72%, 45%)",
    bgColor: "hsl(145, 72%, 45%, 0.15)",
  },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

interface PowerUpState {
  fifty_fifty: number;
  skip: number;
  hint: number;
  extra_time: number;
}

interface UsePowerUpsOptions {
  availablePowerUps?: PowerUpType[];
}

export function useGamePowerUps(options?: UsePowerUpsOptions) {
  const available = options?.availablePowerUps ?? ["fifty_fifty", "skip", "hint", "extra_time"];

  const [counts, setCounts] = useState<PowerUpState>({
    fifty_fifty: available.includes("fifty_fifty") ? 1 : 0,
    skip: available.includes("skip") ? 1 : 0,
    hint: available.includes("hint") ? 1 : 0,
    extra_time: available.includes("extra_time") ? 1 : 0,
  });

  const [usedThisQuestion, setUsedThisQuestion] = useState<Set<PowerUpType>>(new Set());
  const [activatedPopup, setActivatedPopup] = useState<PowerUpType | null>(null);

  const use = useCallback((type: PowerUpType): boolean => {
    if (counts[type] <= 0 || usedThisQuestion.has(type)) return false;
    setCounts((c) => ({ ...c, [type]: c[type] - 1 }));
    setUsedThisQuestion((s) => new Set(s).add(type));
    setActivatedPopup(type);
    setTimeout(() => setActivatedPopup(null), 1200);
    return true;
  }, [counts, usedThisQuestion]);

  const resetForNextQuestion = useCallback(() => {
    setUsedThisQuestion(new Set());
  }, []);

  const resetAll = useCallback(() => {
    setCounts({
      fifty_fifty: available.includes("fifty_fifty") ? 1 : 0,
      skip: available.includes("skip") ? 1 : 0,
      hint: available.includes("hint") ? 1 : 0,
      extra_time: available.includes("extra_time") ? 1 : 0,
    });
    setUsedThisQuestion(new Set());
  }, [available]);

  return {
    counts,
    usedThisQuestion,
    activatedPopup,
    use,
    resetForNextQuestion,
    resetAll,
    availablePowerUps: available,
  };
}

// ─── UI Component ────────────────────────────────────────────────────────────

interface PowerUpBarProps {
  counts: PowerUpState;
  usedThisQuestion: Set<PowerUpType>;
  activatedPopup: PowerUpType | null;
  availablePowerUps: PowerUpType[];
  disabled?: boolean;
  onUse: (type: PowerUpType) => void;
}

export function PowerUpBar({
  counts,
  usedThisQuestion,
  activatedPopup,
  availablePowerUps,
  disabled = false,
  onUse,
}: PowerUpBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4 px-2 relative">
      {/* Activation popup */}
      <AnimatePresence>
        {activatedPopup && (
          <motion.div
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: -10, opacity: 1 }}
            exit={{ scale: 0, y: -30, opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full font-display font-bold text-sm shadow-lg"
            style={{
              backgroundColor: POWER_UP_CONFIG[activatedPopup].color,
              color: "white",
            }}
          >
            {POWER_UP_CONFIG[activatedPopup].emoji} {POWER_UP_CONFIG[activatedPopup].label} activated!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2">
        {availablePowerUps.map((type) => {
          const config = POWER_UP_CONFIG[type];
          const remaining = counts[type];
          const usedNow = usedThisQuestion.has(type);
          const isDisabled = disabled || remaining <= 0 || usedNow;

          return (
            <motion.button
              key={type}
              onClick={() => onUse(type)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.1, y: -2 } : {}}
              whileTap={!isDisabled ? { scale: 0.9 } : {}}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl border-2 transition-all cursor-pointer disabled:cursor-default"
              style={{
                backgroundColor: isDisabled ? "hsl(var(--muted))" : config.bgColor,
                borderColor: isDisabled ? "hsl(var(--border))" : config.color,
                opacity: isDisabled ? 0.4 : 1,
              }}
            >
              <span style={{ color: isDisabled ? "hsl(var(--muted-foreground))" : config.color }}>
                {config.icon}
              </span>
              <span
                className="text-[10px] font-display font-bold"
                style={{ color: isDisabled ? "hsl(var(--muted-foreground))" : config.color }}
              >
                {config.label}
              </span>
              {/* Count badge */}
              <motion.span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: remaining > 0 ? config.color : "hsl(var(--muted-foreground))" }}
                animate={remaining <= 0 ? { scale: 0.8 } : {}}
              >
                {remaining}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
