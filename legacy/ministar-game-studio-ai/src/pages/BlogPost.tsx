import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gamepad2, Clock, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
  author_name: string;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  updates: "bg-primary/10 text-primary",
  tips: "bg-secondary/30 text-secondary-foreground",
  features: "bg-accent/10 text-accent",
  guides: "bg-muted text-muted-foreground",
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    setPost(data as BlogPost | null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Post not found</h1>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Ministar<span className="text-primary"> Blog</span>
          </span>
        </Link>
        <Button variant="ghost" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-1" /> All Posts
          </Link>
        </Button>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.guides}`}>
              <Tag className="h-3 w-3 inline mr-1" />
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.reading_time_minutes} min read
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
              {post.author_name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author_name}</p>
              <p className="text-xs">
                {new Date(post.published_at || post.created_at).toLocaleDateString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-10">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </motion.div>
      </article>

      <footer className="px-6 py-8 border-t border-border text-center mt-12">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Gamepad2 className="h-5 w-5" />
          <span className="font-display font-semibold">Ministar Game Studio</span>
        </div>
      </footer>
    </div>
  );
};

export default BlogPostPage;
