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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { topic, category, userId } = await req.json();
    if (!topic || !userId) throw new Error("topic and userId are required");

    const selectedCategory = category || "tips";

    // Generate blog post using AI
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a blog writer for Ministar Game Studio, an AI-powered platform that turns worksheets into interactive educational games for students. Write engaging, helpful blog posts for teachers and educators.

Your writing style is:
- Friendly, warm, and professional
- Practical with actionable tips
- Uses examples from classroom settings
- Optimistic about education technology
- Uses short paragraphs and clear structure

Return a JSON object with these fields:
- title: Catchy blog title (50-70 chars)
- excerpt: Brief summary (120-160 chars)
- content: Full blog post in markdown (800-1500 words). Use ## for headings, **bold** for emphasis, - for lists. Make it scannable with clear sections.
- reading_time_minutes: Estimated reading time (integer)

IMPORTANT: Return ONLY valid JSON, no code fences or extra text.`,
          },
          {
            role: "user",
            content: `Write a blog post about: "${topic}"\nCategory: ${selectedCategory}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API error: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const raw = aiData.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("No content from AI");

    // Parse JSON - handle code fences
    let cleaned = raw;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const blogData = JSON.parse(cleaned);

    // Generate slug
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 80)
      + "-" + Date.now().toString(36);

    // Insert into database
    const { data, error } = await supabase.from("blog_posts").insert({
      user_id: userId,
      title: blogData.title,
      slug,
      excerpt: blogData.excerpt || null,
      content: blogData.content,
      category: selectedCategory,
      reading_time_minutes: blogData.reading_time_minutes || 5,
      author_name: "Ministar Team",
      is_published: false, // Draft by default
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, post: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});