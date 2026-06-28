import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StudentProfile {
  id: string;
  player_name: string;
  avatar: string;
  xp: number;
  level: number;
  total_games_played: number;
  total_correct: number;
  total_questions: number;
  best_streak: number;
  device_id: string;
}

// XP thresholds for each level
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXp(totalXp: number): { level: number; currentLevelXp: number; nextLevelXp: number } {
  let level = 1;
  let xpRemaining = totalXp;
  while (true) {
    const needed = xpForLevel(level);
    if (xpRemaining < needed) {
      return { level, currentLevelXp: xpRemaining, nextLevelXp: needed };
    }
    xpRemaining -= needed;
    level++;
  }
}

export const AVATARS = [
  "🦊", "🐱", "🐶", "🐼", "🦁", "🐸", "🐵", "🦄",
  "🐲", "🦋", "🐢", "🐙", "🦈", "🐬", "🦩", "🐧",
  "🐰", "🐯", "🐮", "🐷", "🐨", "🐻", "🦉", "🐝",
];

export const LEVEL_TITLES = [
  "Beginner",      // 1
  "Learner",       // 2
  "Explorer",      // 3
  "Adventurer",    // 4
  "Scholar",       // 5
  "Champion",      // 6
  "Master",        // 7
  "Wizard",        // 8
  "Legend",         // 9
  "Grandmaster",   // 10+
];

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

function getDeviceId(): string {
  let id = localStorage.getItem("ministar_device_id");
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("ministar_device_id", id);
  }
  return id;
}

interface StudentContextType {
  student: StudentProfile | null;
  loading: boolean;
  isOnboarded: boolean;
  createProfile: (name: string, avatar: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  addGameResult: (xpEarned: number, correct: number, total: number, streak: number) => Promise<{ leveledUp: boolean; newLevel: number }>;
  refreshProfile: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const deviceId = getDeviceId();

  const loadProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("device_id", deviceId)
        .maybeSingle();
      
      if (data && !error) {
        setStudent(data as StudentProfile);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const createProfile = async (name: string, avatar: string) => {
    const { data, error } = await supabase
      .from("student_profiles")
      .insert({
        player_name: name.trim(),
        avatar,
        device_id: deviceId,
      })
      .select()
      .single();
    
    if (error) throw error;
    setStudent(data as StudentProfile);
  };

  const updateAvatar = async (avatar: string) => {
    if (!student) return;
    await supabase
      .from("student_profiles")
      .update({ avatar, updated_at: new Date().toISOString() })
      .eq("id", student.id);
    setStudent({ ...student, avatar });
  };

  const addGameResult = async (
    xpEarned: number, 
    correct: number, 
    total: number, 
    streak: number
  ): Promise<{ leveledUp: boolean; newLevel: number }> => {
    if (!student) return { leveledUp: false, newLevel: 1 };

    const newXp = student.xp + xpEarned;
    const oldLevelInfo = getLevelFromXp(student.xp);
    const newLevelInfo = getLevelFromXp(newXp);
    const leveledUp = newLevelInfo.level > oldLevelInfo.level;

    const updates = {
      xp: newXp,
      level: newLevelInfo.level,
      total_games_played: student.total_games_played + 1,
      total_correct: student.total_correct + correct,
      total_questions: student.total_questions + total,
      best_streak: Math.max(student.best_streak, streak),
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from("student_profiles")
      .update(updates)
      .eq("id", student.id);

    setStudent({ ...student, ...updates });

    return { leveledUp, newLevel: newLevelInfo.level };
  };

  const refreshProfile = loadProfile;

  return (
    <StudentContext.Provider
      value={{
        student,
        loading,
        isOnboarded: !!student,
        createProfile,
        updateAvatar,
        addGameResult,
        refreshProfile,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
}
