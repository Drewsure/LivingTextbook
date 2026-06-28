import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { worksheetId } = await req.json();
    if (!worksheetId) throw new Error("worksheetId is required");

    // Fetch worksheet
    const { data: worksheet, error: wsError } = await supabase
      .from("worksheets")
      .select("*")
      .eq("id", worksheetId)
      .single();
    if (wsError || !worksheet) throw new Error("Worksheet not found");

    // Build content for AI
    let contentForAI = "";
    if (worksheet.content_type === "text" && worksheet.content_text) {
      contentForAI = worksheet.content_text;
    } else if (worksheet.file_url) {
      // For image/PDF, get a signed URL and describe it
      const { data: signedUrl } = await supabase.storage
        .from("worksheets")
        .createSignedUrl(worksheet.file_url, 3600);
      if (signedUrl?.signedUrl) {
        contentForAI = `[This is a ${worksheet.content_type} worksheet. The file is available at: ${signedUrl.signedUrl}]\n\nTitle: ${worksheet.title}`;
      } else {
        contentForAI = `Worksheet titled "${worksheet.title}" (${worksheet.content_type} file, content not directly readable)`;
      }
    }

    if (!contentForAI) throw new Error("No content to analyze");

    const systemPrompt = `You are an expert educational content analyst. You analyze worksheets used by ESL/EFL teachers and extract structured information about the educational content. 

Think step by step:
1. First, identify the PRIMARY TOPIC or THEME of the worksheet (e.g., "Animals", "Food", "Family Members", "Colors", "Pronouns", "Past Tense Verbs")
2. Then determine the grade/proficiency level
3. Extract the KEY VOCABULARY WORDS that students are learning from this worksheet
4. Identify what learning objectives the worksheet serves

CRITICAL: The theme and keywords must accurately reflect what the worksheet is actually teaching. If it's about animals, the keywords should be animal names. If it's about food, the keywords should be food items.`;

    const userPrompt = `Analyze this worksheet content and extract educational metadata:\n\n---\nTitle: ${worksheet.title}\n\nContent:\n${contentForAI}\n---`;

    // Use tool calling for structured output
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
              name: "save_analysis",
              description: "Save the structured analysis of the worksheet",
              parameters: {
                type: "object",
                properties: {
                  theme: {
                    type: "string",
                    description: "The primary educational theme/topic (e.g. 'Animals', 'Food', 'Pronouns')",
                  },
                  grade_level: {
                    type: "string",
                    description: "Estimated grade or proficiency level (e.g. 'K-2', '3-5', 'Beginner', 'Intermediate')",
                  },
                  keywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key vocabulary words from the worksheet (5-15 words)",
                  },
                  learning_objectives: {
                    type: "array",
                    items: { type: "string" },
                    description: "What students should learn from this worksheet (2-4 objectives)",
                  },
                  content_summary: {
                    type: "string",
                    description: "Brief summary of the worksheet content in 1-2 sentences",
                  },
                },
                required: ["theme", "grade_level", "keywords", "learning_objectives", "content_summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "save_analysis" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) throw new Error("Rate limited. Please try again in a moment.");
      if (response.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI did not return structured data");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Save analysis to worksheet
    const { error: updateError } = await supabase
      .from("worksheets")
      .update({ analysis_results: analysis })
      .eq("id", worksheetId);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-worksheet error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
