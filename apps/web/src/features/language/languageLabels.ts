const knownLanguageLabels: Record<string, string> = {
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  th: "Thai",
  es: "Spanish",
  fr: "French",
  vi: "Vietnamese",
};

export function formatLanguageName(languageCode: string): string {
  return knownLanguageLabels[languageCode] ?? languageCode.toUpperCase();
}
