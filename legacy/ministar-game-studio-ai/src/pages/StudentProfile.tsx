import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStudent, getLevelFromXp, getLevelTitle, AVATARS } from "@/lib/student";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Star, Trophy, Zap, Target, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { playLevelUpSound } from "@/utils/audio";

const StudentProfile = () => {
  const { student, updateAvatar, isOnboarded } = useStudent();
  const navigate = useNavigate();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (!isOnboarded) navigate("/play");
  }, [isOnboarded, navigate]);

  if (!student) return null;

  const levelInfo = getLevelFromXp(student.xp);
  const progressPercent = (levelInfo.currentLevelXp / levelInfo.nextLevelXp) * 100;
  const accuracy = student.total_questions > 0 
    ? Math.round((student.total_correct / student.total_questions) * 100) 
    : 0;

  const stats = [
    { icon: <Star className="h-6 w-6 text-primary" />, value: student.xp.toLocaleString(), label: "Total XP", color: "bg-primary/10" },
    { icon: <Gamepad2 className="h-6 w-6 text-game-blue" />, value: student.total_games_played, label: "Games Played", color: "bg-game-blue/10" },
    { icon: <Target className="h-6 w-6 text-game-green" />, value: `${accuracy}%`, label: "Accuracy", color: "bg-game-green/10" },
    { icon: <Trophy className="h-6 w-6 text-game-orange" />, value: `${student.total_correct}/${student.total_questions}`, label: "Correct", color: "bg-game-orange/10" },
    { icon: <Zap className="h-6 w-6 text-game-pink" />, value: student.best_streak, label: "Best Streak", color: "bg-game-pink/10" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/play")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>

        {/* Profile card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xl text-center mb-6 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1), transparent 70%)",
            }}
          />

          {/* Avatar */}
          <motion.button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 text-7xl md:text-8xl mb-2 inline-block cursor-pointer"
          >
            {student.avatar}
          </motion.button>

          {/* Avatar picker */}
          {showAvatarPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 mb-4 bg-muted/50 rounded-2xl p-3 mx-auto"
            >
              {AVATARS.map((a) => (
                <motion.button
                  key={a}
                  onClick={() => {
                    updateAvatar(a);
                    setShowAvatarPicker(false);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-2xl p-1 rounded-lg ${
                    student.avatar === a ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {a}
                </motion.button>
              ))}
            </motion.div>
          )}

          <h1 className="font-display text-2xl md:text-3xl font-black text-foreground relative z-10">
            {student.player_name}
          </h1>

          {/* Level badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display font-bold text-sm mt-2 relative z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4" />
            Level {levelInfo.level} · {getLevelTitle(levelInfo.level)}
          </motion.div>

          {/* XP bar */}
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 font-semibold">
              <span>{levelInfo.currentLevelXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP to Level {levelInfo.level + 1}</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--game-purple)), hsl(var(--game-pink)))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", damping: 15, delay: 0.3 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`${stat.color} rounded-2xl p-4 border border-border text-center`}
            >
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <div className="font-display text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Play button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate("/play")}
            className="w-full rounded-xl h-14 text-lg font-display font-bold shadow-lg"
          >
            <Gamepad2 className="h-5 w-5 mr-2" />
            Play More Games!
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
