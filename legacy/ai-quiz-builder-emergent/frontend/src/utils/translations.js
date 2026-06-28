export const translations = {
  ja: {
    // Instructions
    "Click the correct answer": "正しい答えをクリックしてください",
    "Match the words": "言葉を合わせてください",
    "Spell the word": "言葉をつづってください",
    "Find all the words": "すべての言葉を見つけてください",
    "Choose True or False": "正しいか間違っているか選んでください",
    "Tap to flip the card": "カードをタップしてめくってください",
    "Drag to match pairs": "ペアを合わせるためにドラッグしてください",
    "Listen and repeat": "聞いて繰り返してください",
    "Fill in the blank": "空欄を埋めてください",
    "Complete the sentence": "文を完成させてください",
    "Type here": "ここに入力してください",
    "Choose a game to start playing": "ゲームを選んでプレイを始めよう",
    
    // Game UI
    "Start Game": "ゲームスタート",
    "Next Question": "次の質問",
    "Play Again": "もう一度プレイ",
    "Play": "プレイする",
    "Home": "ホーム",
    "Score": "スコア",
    "Time": "時間",
    "Correct": "正解",
    "Try Again": "もう一度",
    "Well Done": "よくできました",
    "Excellent": "素晴らしい",
    "Good Job": "よくできました",
    "Amazing": "すごい",
    "Perfect": "完璧",
    
    // Results
    "You scored": "あなたのスコア",
    "Great work": "よくできました",
    "Keep practicing": "練習を続けてください",
    
    // Leaderboard
    "Join the Leaderboard": "リーダーボードに参加",
    "Enter your name": "名前を入力してください",
    "Your Score": "あなたのスコア",
    "Add to Leaderboard": "リーダーボードに追加",
    "Top 15 Players": "トップ15プレイヤー",
    
    // Common
    "Question": "質問",
    "of": "の",
    "Exit": "終了"
  },
  en: {
    // Instructions (English - default)
    "Click the correct answer": "Click the correct answer",
    "Match the words": "Match the words",
    "Spell the word": "Spell the word",
    "Find all the words": "Find all the words",
    "Choose True or False": "Choose True or False",
    "Tap to flip the card": "Tap to flip the card",
    "Drag to match pairs": "Drag to match pairs",
    "Listen and repeat": "Listen and repeat",
    "Fill in the blank": "Fill in the blank",
    "Complete the sentence": "Complete the sentence",
    "Type here": "Type here",
    "Choose a game to start playing": "Choose a game to start playing",
    
    // Game UI
    "Start Game": "Start Game!",
    "Next Question": "Next Question",
    "Play Again": "Play Again",
    "Play": "Play",
    "Home": "Home",
    "Score": "Score",
    "Time": "Time",
    "Correct": "Correct!",
    "Try Again": "Try Again!",
    "Well Done": "Well Done!",
    "Excellent": "Excellent!",
    "Good Job": "Good Job!",
    "Amazing": "Amazing!",
    "Perfect": "Perfect!",
    
    // Results
    "You scored": "You scored",
    "Great work": "Great work!",
    "Keep practicing": "Keep practicing!",
    
    // Leaderboard
    "Join the Leaderboard": "Join the Leaderboard!",
    "Enter your name": "Enter your name",
    "Your Score": "Your Score",
    "Add to Leaderboard": "Add to Leaderboard",
    "Top 15 Players": "Top 15 Players",
    
    // Common
    "Question": "Question",
    "of": "of",
    "Exit": "Exit"
  }
};

export function translate(key, language = 'ja') {
  return translations[language]?.[key] || translations['en'][key] || key;
}

// Text-to-speech function for simple English
export function speak(text, language = 'en-US') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8; // Slower for children
    utterance.pitch = 1.1; // Slightly higher pitch
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
