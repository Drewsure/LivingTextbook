ALTER TABLE public.games DROP CONSTRAINT games_game_type_check;

ALTER TABLE public.games ADD CONSTRAINT games_game_type_check CHECK (game_type = ANY (ARRAY[
  'quiz', 'spelling', 'true_false', 'drag_drop', 'memory', 'group_sort', 'fill_blank',
  'word_search', 'hangman', 'typing_race', 'whack_a_mole', 'sentence_builder',
  'balloon_pop', 'flashcards', 'word_ladder', 'odd_one_out', 'scramble_race',
  'crossword', 'jeopardy', 'boss_battle', 'mystery_detective'
]));