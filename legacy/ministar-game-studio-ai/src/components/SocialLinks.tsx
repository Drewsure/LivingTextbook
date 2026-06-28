import { motion } from "framer-motion";

const SOCIAL_LINKS = [
  { name: "Twitter / X", icon: "𝕏", href: "#", label: "Follow us on X" },
  { name: "Facebook", icon: "f", href: "#", label: "Like us on Facebook" },
  { name: "Instagram", icon: "📸", href: "#", label: "Follow us on Instagram" },
  { name: "YouTube", icon: "▶", href: "#", label: "Subscribe on YouTube" },
  { name: "TikTok", icon: "♪", href: "#", label: "Follow us on TikTok" },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <motion.a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={s.label}
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
        >
          {s.icon}
        </motion.a>
      ))}
    </div>
  );
}

export function SocialBanner() {
  return (
    <div className="bg-card/50 border-t border-b border-border py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-semibold">
          Follow us for tips, updates & fun! 🎮
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}