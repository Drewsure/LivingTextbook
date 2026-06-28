import { useCallback, useRef } from "react";
import { Volume2 } from "lucide-react";
import { isMuted } from "@/utils/audio";

// ─── TTS Engine ──────────────────────────────────────

function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() || [];
  const langPrefix = lang.split("-")[0];

  // Prefer Google/Microsoft neural voices (much more natural)
  const neural = voices.find(
    (v) => v.lang.startsWith(langPrefix) && /google|microsoft|natural/i.test(v.name)
  );
  if (neural) return neural;

  // Then any online/cloud voice
  const online = voices.find(
    (v) => v.lang.startsWith(langPrefix) && !v.localService
  );
  if (online) return online;

  // Fallback to local
  const local = voices.find((v) => v.lang.startsWith(langPrefix));
  return local || null;
}

/** Clean text for TTS: remove underscores and placeholder "blank" words,
 *  but keep "blank" when it's part of a title like "Fill in the Blank". */
function cleanForSpeech(text: string): string {
  const cleaned = text.replace(/_+/g, " ");
  // Only strip standalone "blank" if the text looks like a fill-in sentence
  // (i.e., had underscores). Don't strip from titles like "Fill in the Blank".
  const hadUnderscores = /_/.test(text);
  const result = hadUnderscores
    ? cleaned.replace(/\bblank\b/gi, "")
    : cleaned;
  return result.replace(/\s{2,}/g, " ").trim();
}

export function speak(text: string, lang = "en-US") {
  if (isMuted()) return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const cleaned = cleanForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = lang;
  utterance.rate = 0.88;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = getBestVoice(lang);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

// ─── SpeakableText Component ─────────────────────────

interface SpeakableTextProps {
  text: string;
  lang?: string;
  children: React.ReactNode;
  /** Show a small speaker icon */
  showIcon?: boolean;
  /** Additional className for the wrapper */
  className?: string;
  /** Speak on hover (desktop) — default true */
  speakOnHover?: boolean;
  /** Speak on click/tap — default true */
  speakOnClick?: boolean;
  /** If true, wrap as inline-flex instead of flex */
  inline?: boolean;
}

export function SpeakableText({
  text,
  lang = "en-US",
  children,
  showIcon = false,
  className = "",
  speakOnHover = true,
  speakOnClick = true,
  inline = false,
}: SpeakableTextProps) {
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleSpeak = useCallback(() => {
    speak(text, lang);
  }, [text, lang]);

  const handleMouseEnter = useCallback(() => {
    if (!speakOnHover) return;
    hoverTimeout.current = setTimeout(handleSpeak, 200);
  }, [speakOnHover, handleSpeak]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  // IMPORTANT: Do NOT stopPropagation — let button clicks pass through
  const handleClick = useCallback(() => {
    if (!speakOnClick) return;
    handleSpeak();
  }, [speakOnClick, handleSpeak]);

  const Tag = inline ? "span" : "div";

  return (
    <Tag
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`${inline ? "inline-flex" : "flex"} items-center gap-1.5 group ${className}`}
      title="🔊 Hover or tap to hear"
    >
      {children}
      {showIcon && (
        <Volume2 className="h-3.5 w-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      )}
    </Tag>
  );
}
