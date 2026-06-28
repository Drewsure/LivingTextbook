export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
] as const;

type TranslationKey =
  | "upload_worksheet"
  | "my_worksheets"
  | "settings"
  | "type_here"
  | "check"
  | "next"
  | "score"
  | "correct"
  | "incorrect"
  | "leaderboard"
  | "player"
  | "rank"
  | "game_studio"
  | "teacher_preview"
  | "close_preview"
  | "no_worksheets_yet"
  | "upload_first_worksheet"
  | "text"
  | "image"
  | "pdf"
  | "generate_games"
  | "re_analyze"
  | "analyze_worksheet"
  | "analyzing_worksheet"
  | "games"
  | "share_code_copied"
  | "worksheet_deleted"
  | "delete_failed"
  | "worksheet_uploaded"
  | "analysis_complete"
  | "analysis_failed"
  | "games_generated"
  | "game_generation_failed"
  | "upload_file"
  | "click_to_upload"
  | "image_or_pdf"
  | "or"
  | "paste_worksheet_text"
  | "paste_content_here"
  | "upload_and_analyze"
  | "title_optional"
  | "title_placeholder"
  | "teacher_settings"
  | "configure_preferences"
  | "instruction_language"
  | "instruction_language_desc"
  | "upload_failed"
  | "upload_image_or_pdf"
  | "print_qr"
  | "grade"
  | "matching_instruction"
  | "memory_instruction"
  | "group_sort_instruction"
  | "fill_blank_instruction"
  | "quiz_instruction"
  | "spelling_instruction"
  | "true_false_instruction";

const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    upload_worksheet: "Upload Worksheet",
    my_worksheets: "My Worksheets",
    settings: "Settings",
    type_here: "Type your answer here...",
    check: "Check",
    next: "Next",
    score: "Score",
    correct: "Correct!",
    incorrect: "Try again!",
    leaderboard: "Leaderboard",
    player: "Player",
    rank: "Rank",
    game_studio: "Game Studio",
    teacher_preview: "Teacher Preview",
    close_preview: "Close Preview",
    no_worksheets_yet: "No worksheets yet",
    upload_first_worksheet: "Upload your first worksheet to get started!",
    text: "Text",
    image: "Image",
    pdf: "PDF",
    generate_games: "Generate Games",
    re_analyze: "Re-analyze",
    analyze_worksheet: "Analyze Worksheet",
    analyzing_worksheet: "Analyzing worksheet...",
    games: "Games",
    share_code_copied: "Share code copied!",
    worksheet_deleted: "Worksheet deleted",
    delete_failed: "Delete failed",
    worksheet_uploaded: "Worksheet uploaded! Analyzing...",
    analysis_complete: "Analysis complete!",
    analysis_failed: "Analysis failed",
    games_generated: "Games generated!",
    game_generation_failed: "Game generation failed",
    upload_file: "Upload File",
    click_to_upload: "Click to upload a file",
    image_or_pdf: "Image (JPG, PNG) or PDF",
    or: "OR",
    paste_worksheet_text: "Paste worksheet text",
    paste_content_here: "Paste your worksheet content here...",
    upload_and_analyze: "Upload & Analyze",
    title_optional: "Title (optional)",
    title_placeholder: "e.g. Unit 3 - Pronouns",
    teacher_settings: "Teacher Settings",
    configure_preferences: "Configure your instruction language and preferences",
    instruction_language: "Instruction Language",
    instruction_language_desc: "Game instructions will appear in this language. Game content and audio feedback stay in English.",
    upload_failed: "Upload failed",
    upload_image_or_pdf: "Please upload an image or PDF file",
    print_qr: "Print QR Worksheet",
    grade: "Grade",
    matching_instruction: "Tap a word on the left, then tap its match on the right",
    memory_instruction: "Flip cards to find matching pairs",
    group_sort_instruction: "Tap a word, then tap the group it belongs to",
    fill_blank_instruction: "Complete the sentence",
    quiz_instruction: "Choose the correct answer",
    spelling_instruction: "Tap the letters to spell the word",
    true_false_instruction: "Is this statement true or false?",
  },
  ja: {
    upload_worksheet: "ワークシートをアップロード",
    my_worksheets: "マイワークシート",
    settings: "設定",
    type_here: "ここに答えを入力してください...",
    check: "チェック",
    next: "次へ",
    score: "スコア",
    correct: "正解！",
    incorrect: "もう一度！",
    leaderboard: "リーダーボード",
    player: "プレイヤー",
    rank: "ランク",
    game_studio: "ゲームスタジオ",
    teacher_preview: "先生プレビュー",
    close_preview: "プレビューを閉じる",
    no_worksheets_yet: "ワークシートはまだありません",
    upload_first_worksheet: "最初のワークシートをアップロードして始めましょう！",
    text: "テキスト",
    image: "画像",
    pdf: "PDF",
    generate_games: "ゲームを生成",
    re_analyze: "再分析",
    analyze_worksheet: "ワークシートを分析",
    analyzing_worksheet: "ワークシートを分析中...",
    games: "ゲーム",
    share_code_copied: "共有コードをコピーしました！",
    worksheet_deleted: "ワークシートを削除しました",
    delete_failed: "削除に失敗しました",
    worksheet_uploaded: "ワークシートをアップロードしました！分析中...",
    analysis_complete: "分析完了！",
    analysis_failed: "分析に失敗しました",
    games_generated: "ゲームを生成しました！",
    game_generation_failed: "ゲーム生成に失敗しました",
    upload_file: "ファイルをアップロード",
    click_to_upload: "クリックしてファイルをアップロード",
    image_or_pdf: "画像（JPG、PNG）またはPDF",
    or: "または",
    paste_worksheet_text: "ワークシートのテキストを貼り付け",
    paste_content_here: "ワークシートの内容をここに貼り付けてください...",
    upload_and_analyze: "アップロード＆分析",
    title_optional: "タイトル（任意）",
    title_placeholder: "例：ユニット3 - 代名詞",
    teacher_settings: "先生の設定",
    configure_preferences: "指導言語と設定を変更します",
    instruction_language: "指導言語",
    instruction_language_desc: "ゲームの指示はこの言語で表示されます。ゲームの内容と音声フィードバックは英語のままです。",
    upload_failed: "アップロードに失敗しました",
    upload_image_or_pdf: "画像またはPDFファイルをアップロードしてください",
    print_qr: "QRワークシートを印刷",
    grade: "レベル",
    matching_instruction: "左の単語をタップし、右から合うものをタップしてね",
    memory_instruction: "カードをめくってペアを見つけよう",
    group_sort_instruction: "単語をタップして、合うグループをタップしてね",
    fill_blank_instruction: "文を完成させよう",
    quiz_instruction: "正しい答えを選ぼう",
    spelling_instruction: "文字をタップして単語をつづろう",
    true_false_instruction: "この文は正しい？まちがい？",
  },
};

export function t(key: TranslationKey, lang: string = "en"): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
