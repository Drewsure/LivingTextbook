import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATARS } from "@/lib/student";
import { Sparkles, ArrowRight } from "lucide-react";

interface StudentOnboardingProps {
  onComplete: (name: string, avatar: string) => Promise<void>;
}

export function StudentOnboarding({ onComplete }: StudentOnboardingProps) {
  const [step, setStep] = useState<"name" | "avatar">("name");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onComplete(name, selectedAvatar);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-full max-w-md text-center"
      >
        <AnimatePresence mode="wait">
          {step === "name" ? (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Waving emoji */}
              <motion.div
                className="text-7xl mb-4"
                animate={{ rotate: [0, 15, -15, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.div>

              <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-2">
                Welcome, Player!
              </h1>
              <p className="text-muted-foreground font-body mb-8">
                What should we call you?
              </p>

              <div className="bg-card rounded-3xl p-6 border border-border shadow-xl space-y-4">
                <Input
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-xl font-display font-bold h-14 rounded-xl"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("avatar")}
                />
                <Button
                  onClick={() => setStep("avatar")}
                  disabled={!name.trim()}
                  className="w-full rounded-xl text-lg py-6 font-display font-bold"
                >
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
            >
              {/* Selected avatar big */}
              <motion.div
                key={selectedAvatar}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 8 }}
                className="text-7xl mb-2"
              >
                {selectedAvatar}
              </motion.div>

              <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-1">
                Hi, {name}!
              </h1>
              <p className="text-muted-foreground font-body mb-6">
                Pick your avatar
              </p>

              <div className="bg-card rounded-3xl p-6 border border-border shadow-xl">
                <div className="grid grid-cols-6 gap-2 mb-6">
                  {AVATARS.map((avatar) => (
                    <motion.button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-3xl p-2 rounded-xl transition-all ${
                        selectedAvatar === avatar
                          ? "bg-primary/15 ring-2 ring-primary shadow-lg scale-110"
                          : "hover:bg-muted"
                      }`}
                    >
                      {avatar}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("name")}
                    className="rounded-xl font-display font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 rounded-xl text-lg py-6 font-display font-bold"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {submitting ? "Creating..." : "Let's Play!"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
