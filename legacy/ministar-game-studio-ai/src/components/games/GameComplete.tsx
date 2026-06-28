import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Clock, RotateCcw, Award, Flame, ArrowUp, Sparkles } from "lucide-react";
import { playCompleteSound, playLevelUpSound } from "@/utils/audio";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConfettiBurst, FloatingStars, EmojiBurst } from "./effects/Particles";
import { useStudent, getLevelFromXp, getLevelTitle } from "@/lib/student";
import { useAuth } from "@/lib/auth";

interface GameCompleteProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeElapsed: number;
  gameId: string;
  onPlayAgain: () => void;
  onExit: () => void;
  instructionLang?: string;
}

type CompletionCopyKey =
  | "level_up"
  | "level"
  | "perfect_score"
  | "amazing"
  | "great_job"
  | "good_effort"
  | "keep_going"
  | "msg_perfect"
  | "msg_amazing"
  | "msg_great"
  | "msg_good"
  | "msg_keep"
  | "accuracy"
  | "correct"
  | "time"
  | "save_to_leaderboard"
  | "saving"
  | "score_saved"
  | "view_leaderboard"
  | "play_again"
  | "more_games"
  | "score_submitted"
  | "score_submit_failed";

const COMPLETION_COPY: Record<string, Record<CompletionCopyKey, string>> = {
  en: {
    level_up: "LEVEL UP!",
    level: "Level",
    perfect_score: "PERFECT SCORE!",
    amazing: "AMAZING!",
    great_job: "GREAT JOB!",
    good_effort: "GOOD EFFORT!",
    keep_going: "KEEP GOING!",
    msg_perfect: "You're a genius! Not a single mistake! 🧠",
    msg_amazing: "So close to perfection! Incredible work!",
    msg_great: "You're learning fast! Keep it up!",
    msg_good: "Practice makes perfect! Try again?",
    msg_keep: "Every expert was once a beginner. You got this!",
    accuracy: "Accuracy",
    correct: "Correct",
    time: "Time",
    save_to_leaderboard: "Save to Leaderboard",
    saving: "Saving...",
    score_saved: "Score saved!",
    view_leaderboard: "View Leaderboard",
    play_again: "Play Again",
    more_games: "More Games",
    score_submitted: "Score submitted! 🎉",
    score_submit_failed: "Failed to submit score",
  },
  ja: {
    level_up: "レベルアップ！",
    level: "レベル",
    perfect_score: "満点！",
    amazing: "すばらしい！",
    great_job: "よくできました！",
    good_effort: "よくがんばった！",
    keep_going: "この調子！",
    msg_perfect: "天才だね！ミスなし！🧠",
    msg_amazing: "満点まであと少し！すごい！",
    msg_great: "どんどん上達してるよ！",
    msg_good: "練習すればもっと上手になるよ！",
    msg_keep: "名人も最初は初心者。君ならできる！",
    accuracy: "正確率",
    correct: "正解数",
    time: "時間",
    save_to_leaderboard: "ランキングに保存",
    saving: "保存中...",
    score_saved: "スコアを保存しました！",
    view_leaderboard: "ランキングを見る",
    play_again: "もう一度遊ぶ",
    more_games: "他のゲーム",
    score_submitted: "スコア送信完了！🎉",
    score_submit_failed: "スコア送信に失敗しました",
  },
  ko: {
    level_up: "레벨 업!",
    level: "레벨",
    perfect_score: "완벽해요!",
    amazing: "대단해요!",
    great_job: "아주 잘했어요!",
    good_effort: "좋은 시도였어요!",
    keep_going: "계속 도전해요!",
    msg_perfect: "천재네요! 실수 하나도 없어요! 🧠",
    msg_amazing: "완벽에 거의 다 왔어요! 멋져요!",
    msg_great: "정말 빠르게 배우고 있어요!",
    msg_good: "연습하면 더 잘할 수 있어요!",
    msg_keep: "전문가도 처음엔 초보였어요. 할 수 있어요!",
    accuracy: "정확도",
    correct: "정답",
    time: "시간",
    save_to_leaderboard: "리더보드에 저장",
    saving: "저장 중...",
    score_saved: "점수가 저장되었어요!",
    view_leaderboard: "리더보드 보기",
    play_again: "다시 하기",
    more_games: "더 많은 게임",
    score_submitted: "점수 제출 완료! 🎉",
    score_submit_failed: "점수 제출에 실패했어요",
  },
  zh: {
    level_up: "升级了！",
    level: "等级",
    perfect_score: "满分！",
    amazing: "太棒了！",
    great_job: "做得很好！",
    good_effort: "很努力！",
    keep_going: "继续加油！",
    msg_perfect: "你真是天才！一次都没错！🧠",
    msg_amazing: "离满分只差一点点！太厉害了！",
    msg_great: "你学得很快，继续保持！",
    msg_good: "熟能生巧，再试一次？",
    msg_keep: "每位专家都曾是新手。你可以的！",
    accuracy: "正确率",
    correct: "答对",
    time: "时间",
    save_to_leaderboard: "保存到排行榜",
    saving: "保存中...",
    score_saved: "分数已保存！",
    view_leaderboard: "查看排行榜",
    play_again: "再玩一次",
    more_games: "更多游戏",
    score_submitted: "分数提交成功！🎉",
    score_submit_failed: "分数提交失败",
  },
  es: {
    level_up: "¡SUBISTE DE NIVEL!",
    level: "Nivel",
    perfect_score: "¡PUNTUACIÓN PERFECTA!",
    amazing: "¡INCREÍBLE!",
    great_job: "¡MUY BIEN!",
    good_effort: "¡BUEN ESFUERZO!",
    keep_going: "¡SIGUE ASÍ!",
    msg_perfect: "¡Eres un genio! ¡Ni un error! 🧠",
    msg_amazing: "¡Muy cerca de la perfección!",
    msg_great: "¡Aprendes muy rápido!",
    msg_good: "La práctica hace al maestro. ¿Otra vez?",
    msg_keep: "Todo experto fue principiante. ¡Tú puedes!",
    accuracy: "Precisión",
    correct: "Correctas",
    time: "Tiempo",
    save_to_leaderboard: "Guardar en clasificación",
    saving: "Guardando...",
    score_saved: "¡Puntuación guardada!",
    view_leaderboard: "Ver clasificación",
    play_again: "Jugar de nuevo",
    more_games: "Más juegos",
    score_submitted: "¡Puntuación enviada! 🎉",
    score_submit_failed: "Error al enviar la puntuación",
  },
  pt: {
    level_up: "SUBIU DE NÍVEL!",
    level: "Nível",
    perfect_score: "PONTUAÇÃO PERFEITA!",
    amazing: "INCRÍVEL!",
    great_job: "ÓTIMO TRABALHO!",
    good_effort: "BOM ESFORÇO!",
    keep_going: "CONTINUE!",
    msg_perfect: "Você é genial! Nenhum erro! 🧠",
    msg_amazing: "Quase perfeito! Trabalho incrível!",
    msg_great: "Você está aprendendo rápido!",
    msg_good: "A prática leva à perfeição!",
    msg_keep: "Todo especialista já foi iniciante. Você consegue!",
    accuracy: "Precisão",
    correct: "Corretas",
    time: "Tempo",
    save_to_leaderboard: "Salvar no ranking",
    saving: "Salvando...",
    score_saved: "Pontuação salva!",
    view_leaderboard: "Ver ranking",
    play_again: "Jogar novamente",
    more_games: "Mais jogos",
    score_submitted: "Pontuação enviada! 🎉",
    score_submit_failed: "Falha ao enviar pontuação",
  },
  fr: {
    level_up: "NIVEAU SUPÉRIEUR !",
    level: "Niveau",
    perfect_score: "SCORE PARFAIT !",
    amazing: "INCROYABLE !",
    great_job: "BRAVO !",
    good_effort: "BEL EFFORT !",
    keep_going: "CONTINUE !",
    msg_perfect: "Tu es un génie ! Aucune erreur ! 🧠",
    msg_amazing: "Presque parfait ! Super travail !",
    msg_great: "Tu apprends très vite !",
    msg_good: "C'est en pratiquant qu'on progresse !",
    msg_keep: "Chaque expert a été débutant. Tu peux le faire !",
    accuracy: "Précision",
    correct: "Correct",
    time: "Temps",
    save_to_leaderboard: "Enregistrer au classement",
    saving: "Enregistrement...",
    score_saved: "Score enregistré !",
    view_leaderboard: "Voir le classement",
    play_again: "Rejouer",
    more_games: "Plus de jeux",
    score_submitted: "Score envoyé ! 🎉",
    score_submit_failed: "Échec de l'envoi du score",
  },
  de: {
    level_up: "LEVEL AUFGESTIEGEN!",
    level: "Level",
    perfect_score: "PERFEKTE PUNKTZAHL!",
    amazing: "GROSSARTIG!",
    great_job: "SUPER GEMACHT!",
    good_effort: "GUTE LEISTUNG!",
    keep_going: "WEITER SO!",
    msg_perfect: "Du bist ein Genie! Kein einziger Fehler! 🧠",
    msg_amazing: "Fast perfekt! Unglaubliche Leistung!",
    msg_great: "Du lernst sehr schnell!",
    msg_good: "Übung macht den Meister!",
    msg_keep: "Jeder Experte war mal Anfänger. Du schaffst das!",
    accuracy: "Genauigkeit",
    correct: "Richtig",
    time: "Zeit",
    save_to_leaderboard: "In Rangliste speichern",
    saving: "Speichern...",
    score_saved: "Punktzahl gespeichert!",
    view_leaderboard: "Rangliste ansehen",
    play_again: "Nochmal spielen",
    more_games: "Mehr Spiele",
    score_submitted: "Punktzahl gesendet! 🎉",
    score_submit_failed: "Senden der Punktzahl fehlgeschlagen",
  },
  vi: {
    level_up: "LÊN CẤP!",
    level: "Cấp",
    perfect_score: "ĐIỂM TUYỆT ĐỐI!",
    amazing: "TUYỆT VỜI!",
    great_job: "LÀM TỐT LẮM!",
    good_effort: "CỐ GẮNG TỐT!",
    keep_going: "TIẾP TỤC NHÉ!",
    msg_perfect: "Bạn thật xuất sắc! Không sai câu nào! 🧠",
    msg_amazing: "Rất gần hoàn hảo!",
    msg_great: "Bạn học rất nhanh!",
    msg_good: "Có công mài sắt, có ngày nên kim!",
    msg_keep: "Ai giỏi cũng từng là người mới. Bạn làm được!",
    accuracy: "Độ chính xác",
    correct: "Đúng",
    time: "Thời gian",
    save_to_leaderboard: "Lưu lên bảng xếp hạng",
    saving: "Đang lưu...",
    score_saved: "Đã lưu điểm!",
    view_leaderboard: "Xem bảng xếp hạng",
    play_again: "Chơi lại",
    more_games: "Thêm trò chơi",
    score_submitted: "Đã gửi điểm! 🎉",
    score_submit_failed: "Gửi điểm thất bại",
  },
  th: {
    level_up: "เลเวลอัป!",
    level: "เลเวล",
    perfect_score: "คะแนนเต็ม!",
    amazing: "ยอดเยี่ยม!",
    great_job: "ทำได้ดีมาก!",
    good_effort: "พยายามได้ดี!",
    keep_going: "สู้ต่อไป!",
    msg_perfect: "เก่งมาก! ไม่ผิดเลยสักข้อ! 🧠",
    msg_amazing: "ใกล้สมบูรณ์แบบมาก!",
    msg_great: "คุณเรียนรู้ได้เร็วมาก!",
    msg_good: "ฝึกฝนบ่อย ๆ แล้วจะเก่งขึ้น!",
    msg_keep: "ผู้เชี่ยวชาญทุกคนเคยเป็นมือใหม่มาก่อน สู้ ๆ!",
    accuracy: "ความแม่นยำ",
    correct: "ตอบถูก",
    time: "เวลา",
    save_to_leaderboard: "บันทึกลงลีดเดอร์บอร์ด",
    saving: "กำลังบันทึก...",
    score_saved: "บันทึกคะแนนแล้ว!",
    view_leaderboard: "ดูลีดเดอร์บอร์ด",
    play_again: "เล่นอีกครั้ง",
    more_games: "เกมเพิ่มเติม",
    score_submitted: "ส่งคะแนนแล้ว! 🎉",
    score_submit_failed: "ส่งคะแนนไม่สำเร็จ",
  },
};

function StarRating({ percentage }: { percentage: number }) {
  const stars = percentage >= 100 ? 3 : percentage >= 70 ? 2 : percentage >= 40 ? 1 : 0;
  
  return (
    <div className="flex gap-2 justify-center my-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={i < stars ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.6, rotate: 0, opacity: 0.2 }}
          transition={{ delay: 0.5 + i * 0.25, type: "spring", damping: 8 }}
        >
          <Star
            className={`h-12 w-12 md:h-16 md:w-16 ${
              i < stars ? "text-secondary fill-secondary drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]" : "text-muted"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

function LevelUpOverlay({
  level,
  onDone,
  levelUpLabel,
  levelLabel,
}: {
  level: number;
  onDone: () => void;
  levelUpLabel: string;
  levelLabel: string;
}) {
  useEffect(() => {
    playLevelUpSound();
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-background/95 backdrop-blur-md flex items-center justify-center"
    >
      <ConfettiBurst count={80} duration={2.5} />
      <FloatingStars count={15} />
      <EmojiBurst emoji="⭐" count={10} />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ type: "spring", damping: 8, delay: 0.3 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowUp className="h-12 w-12 text-primary mx-auto mb-2" />
        </motion.div>
        <h1 className="font-display text-5xl md:text-7xl font-black text-primary mb-2 drop-shadow-2xl">
          {levelUpLabel}
        </h1>
        <div className="text-6xl md:text-8xl mb-4">🎉</div>
        <div className="font-display text-3xl md:text-4xl font-black text-foreground mb-1">
          {levelLabel} {level}
        </div>
        <div className="font-display text-xl text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {getLevelTitle(level)}
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function GameComplete({
  score,
  correctCount,
  totalQuestions,
  timeElapsed,
  gameId,
  onPlayAgain,
  onExit,
  instructionLang,
}: GameCompleteProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { student, isOnboarded, addGameResult } = useStudent();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);

  const baseLang = (instructionLang || profile?.instruction_language || "en").toLowerCase().split("-")[0];
  const copyLang = COMPLETION_COPY[baseLang] ? baseLang : "en";
  const copy = (key: CompletionCopyKey) => {
    const english = COMPLETION_COPY.en[key];
    if (copyLang === "en") return english;
    return `${english} / ${COMPLETION_COPY[copyLang][key] ?? english}`;
  };

  useEffect(() => {
    playCompleteSound();
    const t = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-save XP when component mounts
  useEffect(() => {
    if (isOnboarded && !xpSaved) {
      setXpSaved(true);
      const bestStreak = 0; // We don't track max streak in game state yet, use 0
      addGameResult(score, correctCount, totalQuestions, bestStreak).then(({ leveledUp, newLevel: nl }) => {
        if (leveledUp) {
          setNewLevel(nl);
          setTimeout(() => setShowLevelUp(true), 1500);
        }
      });
    }
  }, [isOnboarded, xpSaved, score, correctCount, totalQuestions, addGameResult]);

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = Math.floor(timeElapsed % 60);

  const getEmoji = () => {
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "🎉";
    if (percentage >= 40) return "💪";
    return "📚";
  };

  const messageKey: CompletionCopyKey =
    percentage === 100 ? "perfect_score" : percentage >= 80 ? "amazing" : percentage >= 60 ? "great_job" : percentage >= 40 ? "good_effort" : "keep_going";

  const subMessageKey: CompletionCopyKey =
    percentage === 100 ? "msg_perfect" : percentage >= 80 ? "msg_amazing" : percentage >= 60 ? "msg_great" : percentage >= 40 ? "msg_good" : "msg_keep";

  const submitScore = async () => {
    if (!student) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leaderboard_entries").insert({
        game_id: gameId,
        player_name: student.player_name,
        score,
        time_taken_seconds: timeElapsed,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success(copy("score_submitted"));
    } catch {
      toast.error(copy("score_submit_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const studentLevelInfo = student ? getLevelFromXp(student.xp) : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Level up overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpOverlay
            level={newLevel}
            onDone={() => setShowLevelUp(false)}
            levelUpLabel={copy("level_up")}
            levelLabel={copy("level")}
          />
        )}
      </AnimatePresence>

      {/* Full-screen effects */}
      <ConfettiBurst count={60} duration={2} />
      {percentage >= 80 && <FloatingStars count={12} />}
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: percentage >= 80 
            ? "radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.15), transparent 70%)"
            : "radial-gradient(circle at 50% 40%, hsl(var(--game-blue) / 0.1), transparent 70%)",
        }}
      />

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-full max-w-md text-center relative z-10"
          >
            {/* Student avatar + name */}
            {student && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                <span className="text-3xl">{student.avatar}</span>
                <span className="font-display font-bold text-foreground">{student.player_name}</span>
              </motion.div>
            )}

            {/* Big emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 8 }}
              className="text-7xl md:text-8xl mb-2"
            >
              {getEmoji()}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl md:text-4xl font-black text-foreground mb-1 tracking-tight"
            >
              {copy(messageKey)}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground font-body mb-2"
            >
              {copy(subMessageKey)}
            </motion.p>

            <StarRating percentage={percentage} />

            {/* XP Gain with level info */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary font-display font-bold text-lg mb-4"
            >
              <Star className="h-5 w-5 fill-current" />
              +{score} XP
              {studentLevelInfo && (
                <span className="text-sm text-muted-foreground ml-1">
                  · Lv.{studentLevelInfo.level}
                </span>
              )}
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <Award className="h-6 w-6 text-primary" />, value: `${percentage}%`, label: copy("accuracy"), delay: 0.6 },
                { icon: <Trophy className="h-6 w-6 text-game-orange" />, value: `${correctCount}/${totalQuestions}`, label: copy("correct"), delay: 0.7 },
                { icon: <Clock className="h-6 w-6 text-game-blue" />, value: `${minutes}:${seconds.toString().padStart(2, "0")}`, label: copy("time"), delay: 0.8 },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: stat.delay, type: "spring" }}
                  className="bg-card rounded-2xl p-3 border border-border shadow-lg"
                >
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <div className="font-display text-xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Leaderboard submit - auto-uses student name */}
            {student && !submitted ? (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={submitScore}
                  disabled={submitting}
                  className="w-full rounded-xl min-h-12 py-3 h-auto font-display font-bold mb-4 whitespace-normal"
                  variant="outline"
                >
                  <Flame className="h-4 w-4 mr-2 text-game-orange" />
                  {submitting ? copy("saving") : copy("save_to_leaderboard")}
                </Button>
              </motion.div>
            ) : submitted ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-game-green/10 text-game-green rounded-2xl p-3 mb-4 font-display font-bold border border-game-green/20"
              >
                ✅ {copy("score_saved")}
              </motion.div>
            ) : null}

            {/* Leaderboard link */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate(`/leaderboard/${gameId}`)}
                className="w-full rounded-xl min-h-10 py-2 h-auto font-display font-bold text-primary mb-2 whitespace-normal"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {copy("view_leaderboard")}
              </Button>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-3"
            >
              <Button onClick={onPlayAgain} variant="outline" className="flex-1 rounded-xl min-h-12 py-3 h-auto font-display font-bold whitespace-normal">
                <RotateCcw className="h-4 w-4 mr-2" />
                {copy("play_again")}
              </Button>
              <Button onClick={onExit} className="flex-1 rounded-xl min-h-12 py-3 h-auto font-display font-bold whitespace-normal">
                🎮 {copy("more_games")}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
