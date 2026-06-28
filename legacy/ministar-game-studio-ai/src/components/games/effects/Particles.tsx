import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--game-green))",
  "hsl(var(--game-orange))",
  "hsl(var(--game-pink))",
  "hsl(var(--secondary))",
  "hsl(var(--game-blue))",
  "#FFD700",
  "#FF69B4",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  shape: "circle" | "rect" | "star";
  delay: number;
}

function generateParticles(count: number, originX = 50, originY = 50): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: originX,
    y: originY,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 10,
    angle: (360 / count) * i + (Math.random() - 0.5) * 30,
    distance: 80 + Math.random() * 180,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.15,
  }));
}

/** Full-screen confetti burst */
export function ConfettiBurst({ count = 40, duration = 1.5 }: { count?: number; duration?: number }) {
  const [particles] = useState(() => generateParticles(count));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const endX = Math.cos(rad) * p.distance;
        const endY = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 1, 
              x: `${p.x}%`, 
              y: `${p.y}%`, 
              scale: 0,
              rotate: 0 
            }}
            animate={{
              opacity: [1, 1, 0],
              x: `calc(${p.x}% + ${endX}px)`,
              y: `calc(${p.y}% + ${endY + 100}px)`,
              scale: [0, 1.5, 0.5],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{ duration, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "2px" : "2px",
              transform: p.shape === "rect" ? "rotate(45deg)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/** Floating stars that rise up */
export function FloatingStars({ count = 8 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: "100vh", 
            x: `${10 + Math.random() * 80}%`,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: "-10vh",
            scale: [0.5, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2 + Math.random() * 1.5, 
            delay: i * 0.2,
            ease: "easeOut" 
          }}
          className="absolute text-2xl md:text-3xl"
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}

/** Score popup that flies up with combo text */
export function ScorePopup({ 
  points, 
  streak, 
  x = "50%", 
  y = "40%" 
}: { 
  points: number; 
  streak: number; 
  x?: string; 
  y?: string;
}) {
  const comboTexts = ["", "", "Double!", "Triple!", "Mega!", "ULTRA!", "LEGENDARY!"];
  const comboText = comboTexts[Math.min(streak, comboTexts.length - 1)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.3 }}
      animate={{ opacity: [1, 1, 0], y: -80, scale: [0.3, 1.5, 1] }}
      transition={{ duration: 1.2 }}
      className="fixed pointer-events-none z-[101]"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <div className="text-center">
        <div className="font-display font-black text-3xl md:text-4xl text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          +{points}
        </div>
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-lg text-game-orange drop-shadow-lg"
          >
            🔥 {comboText} {streak}x
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** Screen flash effect for correct/wrong */
export function ScreenFlash({ 
  type 
}: { 
  type: "correct" | "incorrect" 
}) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 pointer-events-none z-[98] ${
        type === "correct" 
          ? "bg-game-green" 
          : "bg-destructive"
      }`}
    />
  );
}

/** Emoji burst from a point */
export function EmojiBurst({ 
  emoji = "🎉", 
  count = 6 
}: { 
  emoji?: string; 
  count?: number;
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i;
        const rad = (angle * Math.PI) / 180;
        const dist = 60 + Math.random() * 100;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist - 40,
              scale: [0, 1.5, 0.8],
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1, delay: i * 0.03, ease: "easeOut" }}
            className="absolute text-2xl md:text-3xl"
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}

/** Countdown timer overlay (3, 2, 1, GO!) */
export function CountdownOverlay({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        key={count}
        initial={{ scale: 3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="text-center"
      >
        {count > 0 ? (
          <span className="font-display text-8xl md:text-[10rem] font-black text-primary drop-shadow-2xl">
            {count}
          </span>
        ) : (
          <span className="font-display text-6xl md:text-8xl font-black text-game-green drop-shadow-2xl">
            GO! 🚀
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Streak fire effect around an element */
export function StreakFire({ streak }: { streak: number }) {
  if (streak < 3) return null;
  
  const intensity = Math.min(streak - 2, 5);
  const flames = ["🔥", "💥", "⚡", "✨", "🌟"];
  
  return (
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1">
      {Array.from({ length: intensity }, (_, i) => (
        <motion.span
          key={i}
          animate={{ 
            y: [0, -8, 0], 
            scale: [1, 1.2, 1],
            rotate: [0, (i % 2 === 0 ? 10 : -10), 0],
          }}
          transition={{ 
            duration: 0.5 + Math.random() * 0.3, 
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="text-lg"
        >
          {flames[i % flames.length]}
        </motion.span>
      ))}
    </div>
  );
}
