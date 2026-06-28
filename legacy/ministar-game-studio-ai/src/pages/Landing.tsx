import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gamepad2, Upload, Sparkles, Users, Zap, Star } from "lucide-react";
import { SocialLinks, SocialBanner } from "@/components/SocialLinks";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            Ministar<span className="text-primary"> Game Studio</span>
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/play">Play a Game</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto text-center">
        {/* Floating decorations */}
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 rounded-2xl bg-secondary/60 rotate-12"
          animate={{ y: [0, -15, 0], rotate: [12, -5, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-32 right-16 w-12 h-12 rounded-full bg-accent/40"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-10 h-10 rounded-lg bg-primary/30 rotate-45"
          animate={{ y: [0, -12, 0], rotate: [45, 30, 45] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Game Creation for Teachers
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Turn Worksheets Into
            <br />
            <span className="text-primary">Epic Games</span>
            <span className="text-accent"> ✨</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload any worksheet and watch AI transform it into interactive,
            engaging games your students will love. Zero friction. Pure magic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-lg animate-pulse-glow" asChild>
              <Link to="/auth">
                <Zap className="h-5 w-5 mr-2" />
                Start Creating Games
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl" asChild>
              <Link to="/play">
                <Gamepad2 className="h-5 w-5 mr-2" />
                I'm a Student
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Worksheet",
                desc: "Snap a photo, upload a PDF, or paste text. That's it!",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Sparkles,
                title: "AI Creates Games",
                desc: "Our AI analyzes your content and generates multiple game types instantly.",
                color: "bg-secondary/30 text-secondary-foreground",
              },
              {
                icon: Star,
                title: "Students Play & Learn",
                desc: "Share a code and watch your students have a blast learning!",
                color: "bg-accent/10 text-accent",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-4`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game types preview */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Multiple Game Types
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            Every worksheet generates a variety of games automatically
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Quiz", emoji: "🎯", bg: "bg-game-purple/10 border-game-purple/20" },
              { name: "Spelling", emoji: "✏️", bg: "bg-game-blue/10 border-game-blue/20" },
              { name: "True / False", emoji: "✅", bg: "bg-game-green/10 border-game-green/20" },
              { name: "Drag & Drop", emoji: "🧩", bg: "bg-game-orange/10 border-game-orange/20" },
            ].map((game) => (
              <motion.div
                key={game.name}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`p-6 rounded-2xl border-2 ${game.bg} cursor-default`}
              >
                <span className="text-4xl mb-3 block">{game.emoji}</span>
                <span className="font-display font-bold text-foreground">{game.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Banner */}
      <SocialBanner />

      {/* Footer */}
      <footer className="px-6 py-10 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-display font-semibold">Ministar Game Studio</span>
            <span>· Making Learning Fun</span>
          </div>
          <SocialLinks className="justify-center" />
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>·</span>
            <Link to="/play" className="hover:text-primary transition-colors">Play a Game</Link>
            <span>·</span>
            <Link to="/auth" className="hover:text-primary transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
