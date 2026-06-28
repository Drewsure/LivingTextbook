import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Gamepad2, ArrowLeft, Loader2, Sparkles, FileText, Eye, Trash2, Edit, ExternalLink, PenLine
} from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

const CATEGORIES = [
  { value: "tips", label: "📚 Tips & Tricks" },
  { value: "updates", label: "🚀 Updates" },
  { value: "features", label: "✨ Features" },
  { value: "guides", label: "📖 Guides" },
];

const BlogManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // AI generation
  const [aiTopic, setAiTopic] = useState("");
  const [aiCategory, setAiCategory] = useState("tips");

  // Manual editor
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("tips");
  const [editPublished, setEditPublished] = useState(false);

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const generateWithAI = async () => {
    if (!aiTopic.trim() || !user) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-post", {
        body: { topic: aiTopic, category: aiCategory, userId: user.id },
      });
      if (error) throw error;
      toast.success("Blog post generated! Review and publish when ready.");
      setAiTopic("");
      await loadPosts();
      // Open editor for the new post
      if (data?.post) {
        openEditor(data.post);
      }
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const openEditor = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt || "");
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditPublished(post.is_published);
  };

  const closeEditor = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditExcerpt("");
    setEditContent("");
    setEditCategory("tips");
    setEditPublished(false);
  };

  const savePost = async () => {
    if (!editingPost) return;
    setSaving(true);
    try {
      const updates: any = {
        title: editTitle,
        excerpt: editExcerpt || null,
        content: editContent,
        category: editCategory,
        is_published: editPublished,
        reading_time_minutes: Math.max(1, Math.ceil(editContent.split(/\s+/).length / 200)),
      };
      if (editPublished && !editingPost.published_at) {
        updates.published_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", editingPost.id);
      if (error) throw error;
      toast.success(editPublished ? "Post published!" : "Post saved as draft.");
      closeEditor();
      loadPosts();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Post deleted");
      loadPosts();
    }
  };

  if (editingPost) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={closeEditor}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-display text-lg font-bold text-foreground">Edit Blog Post</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="publish"
                checked={editPublished}
                onCheckedChange={setEditPublished}
              />
              <Label htmlFor="publish" className="text-sm">
                {editPublished ? "Published" : "Draft"}
              </Label>
            </div>
            <Button onClick={savePost} disabled={saving} className="rounded-xl">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editPublished ? "Publish" : "Save Draft"}
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Post title..."
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="md:col-span-2 text-lg font-bold"
            />
            <Select value={editCategory} onValueChange={setEditCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Short excerpt (for previews)..."
            value={editExcerpt}
            onChange={(e) => setEditExcerpt(e.target.value)}
          />

          <Textarea
            placeholder="Write your blog post content here... (Markdown supported)"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={20}
            className="font-mono text-sm"
          />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{editContent.split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(editContent.split(/\s+/).length / 200))} min read</span>
            {editingPost.slug && (
              <a
                href={`/blog/${editingPost.slug}`}
                target="_blank"
                className="flex items-center gap-1 hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" /> Preview
              </a>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Blog <span className="text-primary">Manager</span>
          </span>
        </div>
        <Button variant="outline" asChild>
          <a href="/blog" target="_blank">
            <Eye className="h-4 w-4 mr-2" /> View Blog
          </a>
        </Button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Tabs defaultValue="generate">
          <TabsList className="mb-6">
            <TabsTrigger value="generate">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText className="h-4 w-4 mr-2" />
              My Posts ({posts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate Blog Post with AI
                </CardTitle>
                <CardDescription>
                  Describe a topic and let AI write an engaging blog post for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Topic / Title Idea</Label>
                  <Textarea
                    placeholder="e.g., 5 creative ways to use word games in the classroom..."
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={aiCategory} onValueChange={setAiCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={generateWithAI}
                  disabled={!aiTopic.trim() || generating}
                  className="w-full rounded-xl"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <PenLine className="h-4 w-4 mr-2" />
                      Generate Blog Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground">Generate your first post with AI!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            post.is_published
                              ? "bg-green-500/10 text-green-600"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary capitalize">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-foreground truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditor(post)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {post.is_published && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="View"
                          >
                            <a href={`/blog/${post.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePost(post.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BlogManager;