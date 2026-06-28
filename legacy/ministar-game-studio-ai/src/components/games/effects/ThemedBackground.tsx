import { motion } from "framer-motion";

export type GameTheme = "space" | "jungle" | "ocean" | "candy" | "neon" | "sakura" | "arctic" | "volcano" | "default";

const THEMES: Record<GameTheme, {
  bg: string;
  particles: { emoji: string; count: number }[];
  gradient: string;
}> = {
  space: {
    bg: "bg-[#0a0a2e]",
    gradient: "from-[#0a0a2e] via-[#1a1a4e] to-[#0a0a2e]",
    particles: [
      { emoji: "⭐", count: 12 },
      { emoji: "🌙", count: 2 },
      { emoji: "🚀", count: 1 },
    ],
  },
  jungle: {
    bg: "bg-[#0d3b0d]",
    gradient: "from-[#0d3b0d] via-[#1a5c1a] to-[#0d3b0d]",
    particles: [
      { emoji: "🌿", count: 8 },
      { emoji: "🦋", count: 3 },
      { emoji: "🌺", count: 4 },
    ],
  },
  ocean: {
    bg: "bg-[#0a1628]",
    gradient: "from-[#0a1628] via-[#0d2847] to-[#0a1628]",
    particles: [
      { emoji: "🐠", count: 5 },
      { emoji: "🫧", count: 10 },
      { emoji: "🐚", count: 3 },
    ],
  },
  candy: {
    bg: "bg-[#2d1038]",
    gradient: "from-[#2d1038] via-[#451050] to-[#2d1038]",
    particles: [
      { emoji: "🍭", count: 5 },
      { emoji: "🍬", count: 4 },
      { emoji: "⭐", count: 6 },
    ],
  },
  neon: {
    bg: "bg-[#0d0d1a]",
    gradient: "from-[#0d0d1a] via-[#1a0d2e] to-[#0d1a1a]",
    particles: [
      { emoji: "💜", count: 4 },
      { emoji: "💙", count: 4 },
      { emoji: "⚡", count: 3 },
      { emoji: "✨", count: 6 },
    ],
  },
  sakura: {
    bg: "bg-[#2e1a2e]",
    gradient: "from-[#2e1a2e] via-[#3d1a30] to-[#2e1a2e]",
    particles: [
      { emoji: "🌸", count: 12 },
      { emoji: "🎀", count: 3 },
      { emoji: "💮", count: 4 },
    ],
  },
  arctic: {
    bg: "bg-[#0a1a2e]",
    gradient: "from-[#0a1a2e] via-[#102840] to-[#0a1a2e]",
    particles: [
      { emoji: "❄️", count: 10 },
      { emoji: "🐧", count: 2 },
      { emoji: "⛄", count: 2 },
      { emoji: "💎", count: 3 },
    ],
  },
  volcano: {
    bg: "bg-[#1a0a0a]",
    gradient: "from-[#1a0a0a] via-[#2e1508] to-[#1a0a0a]",
    particles: [
      { emoji: "🌋", count: 1 },
      { emoji: "🔥", count: 6 },
      { emoji: "💥", count: 3 },
      { emoji: "🪨", count: 4 },
    ],
  },
  default: {
    bg: "bg-background",
    gradient: "",
    particles: [],
  },
};

function FloatingEmoji({ emoji, index, total }: { emoji: string; index: number; total: number }) {
  const startX = (index / total) * 100;
  const startY = Math.random() * 100;
  const duration = 8 + Math.random() * 12;
  const size = 16 + Math.random() * 20;

  return (
    <motion.div
      initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 0.15 }}
      animate={{
        x: [`${startX}vw`, `${startX + (Math.random() - 0.5) * 20}vw`],
        y: [`${startY}vh`, `${(startY + 30) % 100}vh`],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
      className="fixed pointer-events-none z-0"
      style={{ fontSize: size }}
    >
      {emoji}
    </motion.div>
  );
}

export function ThemedBackground({ 
  theme = "default",
  children 
}: { 
  theme?: GameTheme;
  children: React.ReactNode;
}) {
  const config = THEMES[theme];

  if (theme === "default") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {children}
      </div>
    );
  }

  let particleIndex = 0;
  const totalParticles = config.particles.reduce((s, p) => s + p.count, 0);

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-b ${config.gradient}`}>
      {config.particles.map((p) =>
        Array.from({ length: p.count }, (_, i) => {
          particleIndex++;
          return (
            <FloatingEmoji
              key={`${p.emoji}-${i}`}
              emoji={p.emoji}
              index={particleIndex}
              total={totalParticles}
            />
          );
        })
      )}
      
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/** Get a random theme */
export function getRandomTheme(): GameTheme {
  const themes: GameTheme[] = ["space", "jungle", "ocean", "candy", "neon", "sakura", "arctic", "volcano"];
  return themes[Math.floor(Math.random() * themes.length)];
}
