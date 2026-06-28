import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Clock, ArrowRight, Tag, Loader2 } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  const categories = [...new Set(posts.map((p) => p.category))];
  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Ministar<span className="text-primary"> Blog</span>
          </span>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/play">Play a Game</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Latest from <span className="text-primary">Ministar</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, updates, and guides for turning worksheets into epic learning games.
          </p>
        </motion.div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full capitalize"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground">
              We're working on exciting content. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured post */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link to={`/blog/${featured.slug}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <div className="md:flex">
                      {featured.cover_image_url && (
                        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                          <img
                            src={featured.cover_image_url}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className={`p-8 flex flex-col justify-center ${featured.cover_image_url ? "md:w-1/2" : "w-full"}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${CATEGORY_COLORS[featured.category] || CATEGORY_COLORS.guides}`}>
                            <Tag className="h-3 w-3 inline mr-1" />
                            {featured.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {featured.reading_time_minutes} min read
                          </span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {featured.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {featured.author_name} · {new Date(featured.published_at || featured.created_at).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:border-primary/30">
                        {post.cover_image_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.guides}`}>
                              {post.category}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.reading_time_minutes} min
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.published_at || post.created_at).toLocaleDateString("en", { month: "short", day: "numeric" })}
                            </span>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border text-center mt-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-display font-semibold">Ministar Game Studio</span>
            <span>· Making Learning Fun</span>
          </div>
          <SocialLinks className="justify-center" />
        </div>
      </footer>
    </div>
  );
};

export default Blog;
