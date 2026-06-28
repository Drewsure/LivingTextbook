import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { worksheetId } = await req.json();
    if (!worksheetId) throw new Error("worksheetId is required");

    const { data: worksheet, error: wsError } = await supabase
      .from("worksheets")
      .select("*")
      .eq("id", worksheetId)
      .single();
    if (wsError || !worksheet) throw new Error("Worksheet not found");
    if (!worksheet.analysis_results) throw new Error("Worksheet must be analyzed first");

    const analysis = worksheet.analysis_results as any;
    const lang = worksheet.instruction_language || "en";

    const systemPrompt = `You are an expert educational game designer for ESL/EFL students. You create fun, engaging games based on worksheet content.

CRITICAL RULES:
- ALL game content (questions, answers, vocabulary) MUST be directly related to the theme "${analysis.theme}"
- ONLY use these keywords from the worksheet: ${JSON.stringify(analysis.keywords)}
- Game instructions should be in the language code "${lang}" but ALL game CONTENT (questions, answer options, vocabulary words, hints, definitions, sentences, spelling words, letter tiles) MUST be in English ONLY using standard ASCII characters (A-Z, a-z, 0-9, basic punctuation). Do NOT append or mix Japanese, Chinese, Korean, or any other non-Latin characters into answers, options, words, or letters. Every answer option, vocabulary word, and individual letter MUST be pure English ASCII text. This is critically important for spelling games where individual letters are displayed.
- Questions should be age-appropriate for ${analysis.grade_level} level
- Make games fun and educational`;

    const userPrompt = `Create 20 different games based on this worksheet analysis:

Theme: ${analysis.theme}
Keywords: ${JSON.stringify(analysis.keywords)}
Grade Level: ${analysis.grade_level}
Learning Objectives: ${JSON.stringify(analysis.learning_objectives)}
Summary: ${analysis.content_summary}

Generate these game types using ONLY the keywords and theme:

1. **Quiz** - 8-10 multiple choice questions with 4 options each
2. **Spelling** - 8-10 words with hints and example sentences
3. **True/False** - 8-10 statements that are true or false with explanations
4. **Matching** - 8-10 word-to-definition/translation pairs
5. **Memory** - 6 pairs of related items (word + definition) for a memory flip game
6. **Group Sort** - 2-4 category groups, each with 3-5 items
7. **Fill in the Blank** - 8-10 sentences with a missing word and 4 word options
8. **Word Search** - 6-8 vocabulary words to find in a grid
9. **Hangman** - 8-10 words with hints for hangman guessing
10. **Typing Race** - 8-10 words with hints, students type the word quickly
11. **Whack-a-Mole** - 8-10 questions with 1 correct and 3 wrong answers
12. **Sentence Builder** - 6-8 sentences to unscramble (arrange words in correct order)
13. **Balloon Pop** - 8-10 questions with 1 correct and 3 wrong answers (balloon theme)
14. **Flashcards** - 8-10 cards with front (word/question) and back (answer/definition)
15. **Word Ladder** - 2-3 ladders, each with a start word and 3-4 clue/answer steps
16. **Odd One Out** - 8-10 sets of 4 words where one doesn't belong, with explanations
17. **Scramble Race** - 8-10 words with hints, students unscramble the letters against a timer
18. **Crossword** - 8-12 words with clues. Each word has an answer (single word, all caps) and a clue sentence. Mix of across and down directions.
19. **Jeopardy** - 4-5 categories related to the theme, each with 5 questions of increasing difficulty. Each question has a question and an answer.
20. **Dictation** - 6-8 sentences using the vocabulary words. The speaker will read the sentence aloud and the student must arrange the words in the correct order. Sentences should be clear and natural. Include a hint for each.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "save_games",
              description: "Save the generated game data",
              parameters: {
                type: "object",
                properties: {
                  quiz: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            options: { type: "array", items: { type: "string" } },
                            correct_answer: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["question", "options", "correct_answer"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                  spelling: {
                    type: "object",
                    properties: {
                      words: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            word: { type: "string" },
                            hint: { type: "string" },
                            sentence: { type: "string" },
                          },
                          required: ["word", "hint", "sentence"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                  true_false: {
                    type: "object",
                    properties: {
                      statements: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            statement: { type: "string" },
                            is_true: { type: "boolean" },
                            explanation: { type: "string" },
                          },
                          required: ["statement", "is_true", "explanation"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["statements"],
                    additionalProperties: false,
                  },
                  matching: {
                    type: "object",
                    properties: {
                      pairs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            left: { type: "string" },
                            right: { type: "string" },
                          },
                          required: ["left", "right"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["pairs"],
                    additionalProperties: false,
                  },
                  memory: {
                    type: "object",
                    properties: {
                      pairs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            left: { type: "string" },
                            right: { type: "string" },
                          },
                          required: ["left", "right"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["pairs"],
                    additionalProperties: false,
                  },
                  group_sort: {
                    type: "object",
                    properties: {
                      groups: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            items: { type: "array", items: { type: "string" } },
                          },
                          required: ["name", "items"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["groups"],
                    additionalProperties: false,
                  },
                  fill_blank: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            sentence: { type: "string" },
                            answer: { type: "string" },
                            options: { type: "array", items: { type: "string" } },
                          },
                          required: ["sentence", "answer", "options"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                  word_search: {
                    type: "object",
                    properties: {
                      words: { type: "array", items: { type: "string" } },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                  hangman: {
                    type: "object",
                    properties: {
                      words: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            word: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["word", "hint"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                  typing_race: {
                    type: "object",
                    properties: {
                      words: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            word: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["word", "hint"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                  whack_a_mole: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            correct_answer: { type: "string" },
                            wrong_answers: { type: "array", items: { type: "string" } },
                          },
                          required: ["question", "correct_answer", "wrong_answers"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                  sentence_builder: {
                    type: "object",
                    properties: {
                      sentences: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            sentence: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["sentence"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["sentences"],
                    additionalProperties: false,
                  },
                  balloon_pop: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            correct_answer: { type: "string" },
                            wrong_answers: { type: "array", items: { type: "string" } },
                          },
                          required: ["question", "correct_answer", "wrong_answers"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                  flashcards: {
                    type: "object",
                    properties: {
                      cards: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            front: { type: "string" },
                            back: { type: "string" },
                          },
                          required: ["front", "back"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["cards"],
                    additionalProperties: false,
                  },
                  word_ladder: {
                    type: "object",
                    properties: {
                      ladders: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            start_word: { type: "string" },
                            steps: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  clue: { type: "string" },
                                  answer: { type: "string" },
                                },
                                required: ["clue", "answer"],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ["start_word", "steps"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["ladders"],
                    additionalProperties: false,
                  },
                  odd_one_out: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            words: { type: "array", items: { type: "string" }, description: "4 words, one is the odd one" },
                            odd_word: { type: "string" },
                            explanation: { type: "string" },
                          },
                          required: ["words", "odd_word", "explanation"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                  scramble_race: {
                    type: "object",
                    properties: {
                      words: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            word: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["word", "hint"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                  crossword: {
                    type: "object",
                    properties: {
                      clues: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            answer: { type: "string" },
                            clue: { type: "string" },
                            direction: { type: "string", enum: ["across", "down"] },
                          },
                          required: ["answer", "clue", "direction"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["clues"],
                    additionalProperties: false,
                  },
                  jeopardy: {
                    type: "object",
                    properties: {
                      categories: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            questions: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  question: { type: "string" },
                                  answer: { type: "string" },
                                },
                                required: ["question", "answer"],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ["name", "questions"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["categories"],
                    additionalProperties: false,
                  },
                  dictation: {
                    type: "object",
                    properties: {
                      sentences: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            sentence: { type: "string" },
                            hint: { type: "string" },
                          },
                          required: ["sentence"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["sentences"],
                    additionalProperties: false,
                  },
                },
                required: [
                  "quiz", "spelling", "true_false", "matching", "memory", "group_sort", "fill_blank",
                  "word_search", "hangman", "typing_race", "whack_a_mole", "sentence_builder",
                  "balloon_pop", "flashcards", "word_ladder", "odd_one_out", "scramble_race",
                  "crossword", "jeopardy", "dictation"
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "save_games" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) throw new Error("Rate limited. Please try again in a moment.");
      if (response.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      throw new Error("Game generation failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI did not return game data");

    const gameData = JSON.parse(toolCall.function.arguments);

    // ── SANITIZE: Strip non-ASCII from all string values in game data ──────
    function sanitizeGameStrings(obj: any): any {
      if (typeof obj === "string") {
        // Keep only ASCII printable chars + basic whitespace
        return obj.replace(/[^\x20-\x7E]/g, "").replace(/\s{2,}/g, " ").trim();
      }
      if (Array.isArray(obj)) return obj.map(sanitizeGameStrings);
      if (obj && typeof obj === "object") {
        const result: any = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k] = sanitizeGameStrings(v);
        }
        return result;
      }
      return obj;
    }

    // Sanitize spelling words individually to ensure clean letters
    if (Array.isArray(gameData?.spelling?.words)) {
      gameData.spelling.words = gameData.spelling.words.map((w: any) => ({
        ...w,
        word: String(w.word).replace(/[^A-Za-z]/g, ""),
      }));
    }

    // Broad sanitize all string content
    const sanitizedData = sanitizeGameStrings(gameData);
    Object.assign(gameData, sanitizedData);

    const sanitizeEnglishWord = (value: string) =>
      String(value).normalize("NFKD").replace(/[^A-Za-z]/g, "").toUpperCase().trim();

    if (Array.isArray(gameData?.word_search?.words)) {
      const cleanedWordSearchWords = gameData.word_search.words
        .map((w: string) => sanitizeEnglishWord(w))
        .filter((w: string) => w.length >= 2)
        .slice(0, 8);

      if (cleanedWordSearchWords.length > 0) {
        gameData.word_search.words = cleanedWordSearchWords;
      } else {
        const fallbackWords = (analysis?.keywords || [])
          .map((w: string) => sanitizeEnglishWord(w))
          .filter((w: string) => w.length >= 2)
          .slice(0, 8);
        gameData.word_search.words = fallbackWords.length > 0 ? fallbackWords : ["STORM", "WIND", "RAIN"];
      }
    }

    // ── QR LOCK PRESERVATION ─────────────────────────────────────────────────
    // Fetch any existing games so we can preserve share codes that are locked
    // (locked = the teacher has committed them to a term's QR codes / printouts)
    const { data: existingGames } = await supabase
      .from("games")
      .select("id, game_type, share_code, share_code_locked, is_community_shared")
      .eq("worksheet_id", worksheetId);

    // Build a map of game_type → locked row for quick lookup
    const lockedMap = new Map<string, { share_code: string; is_community_shared: boolean }>();
    (existingGames || []).forEach((g) => {
      if (g.share_code_locked) {
        lockedMap.set(g.game_type, {
          share_code: g.share_code,
          is_community_shared: g.is_community_shared ?? false,
        });
      }
    });

    // Delete ONLY the unlocked games so locked QR codes survive regeneration
    const unlockedIds = (existingGames || [])
      .filter((g) => !g.share_code_locked)
      .map((g) => g.id);

    if (unlockedIds.length > 0) {
      await supabase.from("games").delete().in("id", unlockedIds);
    }

    // ── INSERT / UPDATE GAME ROWS ─────────────────────────────────────────────
    const gameTypes = [
      { type: "quiz", data: gameData.quiz },
      { type: "spelling", data: gameData.spelling },
      { type: "true_false", data: gameData.true_false },
      { type: "drag_drop", data: gameData.matching },
      { type: "memory", data: gameData.memory },
      { type: "group_sort", data: gameData.group_sort },
      { type: "fill_blank", data: gameData.fill_blank },
      { type: "word_search", data: gameData.word_search },
      { type: "hangman", data: gameData.hangman },
      { type: "typing_race", data: gameData.typing_race },
      { type: "whack_a_mole", data: gameData.whack_a_mole },
      { type: "sentence_builder", data: gameData.sentence_builder },
      { type: "balloon_pop", data: gameData.balloon_pop },
      { type: "flashcards", data: gameData.flashcards },
      { type: "word_ladder", data: gameData.word_ladder },
      { type: "odd_one_out", data: gameData.odd_one_out },
      { type: "scramble_race", data: gameData.scramble_race },
      { type: "crossword", data: gameData.crossword },
      { type: "jeopardy", data: gameData.jeopardy },
      { type: "dictation", data: gameData.dictation },
    ];

    // For locked game types: update game_data in-place rather than insert new row
    const typesToInsert: typeof gameTypes = [];
    for (const g of gameTypes) {
      if (!g.data) continue;
      const locked = lockedMap.get(g.type);
      if (locked) {
        // Update game_data but keep everything else (share_code, lock status, community flag)
        await supabase
          .from("games")
          .update({ game_data: g.data })
          .eq("worksheet_id", worksheetId)
          .eq("game_type", g.type)
          .eq("share_code_locked", true);
      } else {
        typesToInsert.push(g);
      }
    }

    if (typesToInsert.length > 0) {
      const gamesToInsert = typesToInsert.map((g) => ({
        worksheet_id: worksheetId,
        game_type: g.type,
        game_data: g.data,
        share_code: generateShareCode(),
        is_active: true,
        share_code_locked: false,
        is_community_shared: false,
      }));
      const { error: insertError } = await supabase.from("games").insert(gamesToInsert);
      if (insertError) throw insertError;
    }

    const totalInserted = typesToInsert.length;
    return new Response(JSON.stringify({ success: true, games: totalInserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-games error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
