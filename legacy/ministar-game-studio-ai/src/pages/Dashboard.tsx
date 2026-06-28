import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Upload, FileText, Clipboard, LogOut, Settings, Loader2,
  Eye, Share2, RefreshCw, Trash2, QrCode, Trophy, BarChart3, Printer,
  PenLine, Lock, Unlock, Globe, Users, Calendar, BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { LANGUAGES, t } from "@/utils/translations";
import { QRWorksheet } from "@/components/QRWorksheet";
import { PrintableWorksheet, isPrintable } from "@/components/PrintableWorksheet";
import type { Database } from "@/integrations/supabase/types";

type Worksheet = Database["public"]["Tables"]["worksheets"]["Row"];
type Game = Database["public"]["Tables"]["games"]["Row"];

const GAME_EMOJIS: Record<string, string> = {
  quiz: "🎯", spelling: "✏️", true_false: "✅", drag_drop: "🔗",
  memory: "🃏", group_sort: "📦", fill_blank: "📝", word_search: "🔍",
  hangman: "🪢", typing_race: "⌨️", whack_a_mole: "🔨", sentence_builder: "🏗️",
  balloon_pop: "🎈", flashcards: "💡", word_ladder: "🪜", odd_one_out: "🦎",
  scramble_race: "🏃", crossword: "🗓️", jeopardy: "🏆",
};

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [games, setGames] = useState<Record<string, Game[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [locking, setLocking] = useState<string | null>(null);
  const [instructionLanguage, setInstructionLanguage] = useState(profile?.instruction_language || "en");
  const [qrWorksheet, setQrWorksheet] = useState<{ ws: Worksheet; games: Game[] } | null>(null);
  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const [printGame, setPrintGame] = useState<{ game: Game; title: string } | null>(null);

  const [textContent, setTextContent] = useState("");
  const [worksheetTitle, setWorksheetTitle] = useState("");
  const [activeTab, setActiveTab] = useState("worksheets");

  const lang = instructionLanguage;

  useEffect(() => {
    if (user) loadWorksheets();
  }, [user]);

  const loadWorksheets = async () => {
    const { data } = await supabase
      .from("worksheets")
      .select("*")
      .order("created_at", { ascending: false });
    setWorksheets(data || []);

    if (data && data.length > 0) {
      const { data: allGames } = await supabase
        .from("games")
        .select("*")
        .in("worksheet_id", data.map((w) => w.id));
      const gamesByWorksheet: Record<string, Game[]> = {};
      allGames?.forEach((g) => {
        if (!gamesByWorksheet[g.worksheet_id]) gamesByWorksheet[g.worksheet_id] = [];
        gamesByWorksheet[g.worksheet_id].push(g);
      });
      setGames(gamesByWorksheet);
    }
    setLoading(false);
  };

  const handleTextUpload = async () => {
    if (!textContent.trim() || !user) return;
    setUploading(true);
    try {
      const { data, error } = await supabase.from("worksheets").insert({
        user_id: user.id,
        title: worksheetTitle.trim() || "Untitled Worksheet",
        content_type: "text" as const,
        content_text: textContent.trim(),
        instruction_language: instructionLanguage,
      }).select().single();
      if (error) throw error;
      toast.success(t("worksheet_uploaded", lang));
      setTextContent("");
      setWorksheetTitle("");
      setActiveTab("worksheets");
      await loadWorksheets();
      if (data) analyzeWorksheet(data.id);
    } catch (err: any) {
      toast.error(err.message || t("upload_failed", lang));
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error(t("upload_image_or_pdf", lang));
      return;
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("worksheets").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = await supabase.from("worksheets").insert({
        user_id: user.id,
        title: worksheetTitle.trim() || file.name.replace(/\.[^/.]+$/, ""),
        content_type: isImage ? "image" : "pdf",
        file_url: filePath,
        instruction_language: instructionLanguage,
      }).select().single();

      toast.success(t("worksheet_uploaded", lang));
      setWorksheetTitle("");
      setActiveTab("worksheets");
      await loadWorksheets();
      if (data) analyzeWorksheet(data.id);
    } catch (err: any) {
      toast.error(err.message || t("upload_failed", lang));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const analyzeWorksheet = async (worksheetId: string) => {
    setAnalyzing(worksheetId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-worksheet", {
        body: { worksheetId },
      });
      if (error) throw error;
      toast.success(t("analysis_complete", lang));
      await loadWorksheets();
    } catch (err: any) {
      toast.error(t("analysis_failed", lang) + ": " + (err.message || ""));
    } finally {
      setAnalyzing(null);
    }
  };

  const generateGames = async (worksheetId: string) => {
    setGenerating(worksheetId);
    const toastId = toast.loading("Generating games… this may take a minute ⏳");
    try {
      const { data, error } = await supabase.functions.invoke("generate-games", {
        body: { worksheetId },
      });
      if (error) throw error;
      toast.success("Games generated successfully! 🎮🎉", { id: toastId });
      await loadWorksheets();
    } catch (err: any) {
      toast.error("Game generation failed: " + (err.message || "Unknown error. Please try again."), { id: toastId });
    } finally {
      setGenerating(null);
    }
  };

  // Lock all QR codes for a worksheet (calls DB function)
  const lockQRCodes = async (worksheetId: string) => {
    setLocking(worksheetId);
    try {
      const { error } = await supabase.rpc("lock_worksheet_share_codes", {
        p_worksheet_id: worksheetId,
      });
      if (error) throw error;
      toast.success("QR codes locked for this term 🔒");
      await loadWorksheets();
    } catch (err: any) {
      toast.error("Failed to lock QR codes: " + (err.message || ""));
    } finally {
      setLocking(null);
    }
  };

  // Toggle community sharing for the whole worksheet and its games
  const toggleCommunityShare = async (ws: Worksheet, value: boolean) => {
    const { error: wsErr } = await supabase
      .from("worksheets")
      .update({ is_public: value })
      .eq("id", ws.id);
    if (wsErr) { toast.error("Failed to update community sharing"); return; }

    await supabase
      .from("games")
      .update({ is_community_shared: value })
      .eq("worksheet_id", ws.id);

    toast.success(value ? "Added to Community Bank 🌍" : "Removed from Community Bank");
    await loadWorksheets();
  };

  // Set term end date on a worksheet
  const setTermEndDate = async (worksheetId: string, date: string) => {
    const { error } = await supabase
      .from("worksheets")
      .update({ term_end_date: date || null })
      .eq("id", worksheetId);
    if (error) toast.error("Failed to save term date");
    else {
      toast.success("Term end date saved");
      await loadWorksheets();
    }
  };

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("share_code_copied", lang));
  };

  const deleteWorksheet = async (id: string) => {
    const { error } = await supabase.from("worksheets").delete().eq("id", id);
    if (error) toast.error(t("delete_failed", lang));
    else {
      toast.success(t("worksheet_deleted", lang));
      loadWorksheets();
    }
  };

  const updateLanguage = async (newLang: string) => {
    setInstructionLanguage(newLang);
    if (user) {
      await supabase.from("profiles").update({ instruction_language: newLang }).eq("user_id", user.id);
    }
  };

  const analysis = (ws: Worksheet) => ws.analysis_results as any;
  const baseUrl = window.location.origin;

  const isTermExpired = (ws: Worksheet) => {
    if (!ws.term_end_date) return false;
    return new Date(ws.term_end_date) < new Date();
  };

  const allLocked = (wsId: string) => {
    const wsGames = games[wsId] || [];
    return wsGames.length > 0 && wsGames.every((g) => g.share_code_locked);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* QR Worksheet Modal */}
      {qrWorksheet && (
        <QRWorksheet
          worksheet={qrWorksheet.ws}
          games={qrWorksheet.games}
          baseUrl={baseUrl}
          onClose={() => setQrWorksheet(null)}
        />
      )}

      {/* Printable Worksheet Modal */}
      {printGame && (
        <PrintableWorksheet
          game={printGame.game}
          worksheetTitle={printGame.title}
          onClose={() => setPrintGame(null)}
        />
      )}

      {/* Teacher Preview Modal */}
      {previewGame && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="absolute top-4 right-4 z-[60] flex gap-2">
            <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-display font-bold flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {t("teacher_preview", lang)}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPreviewGame(null)} className="rounded-full">
              ✕ {t("close_preview", lang)}
            </Button>
          </div>
          <iframe
            src={`${baseUrl}/play/${previewGame.share_code}?direct=true`}
            className="w-full h-full border-0"
            title="Game Preview"
          />
        </div>
      )}

      {/* Top bar */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Ministar<span className="text-primary"> {t("game_studio", lang)}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Select value={instructionLanguage} onValueChange={updateLanguage}>
            <SelectTrigger className="w-auto gap-2 rounded-full border-border h-8 px-3 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => navigate("/community")} className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
            <span className="text-xs">Community</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/analytics")} className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/blog-manager")} className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <PenLine className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{profile?.display_name || user?.email}</span>
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="worksheets">
              <FileText className="h-4 w-4 mr-2" />
              {t("my_worksheets", lang)}
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              {t("upload_worksheet", lang)}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              {t("settings", lang)}
            </TabsTrigger>
          </TabsList>

          {/* Worksheets tab */}
          <TabsContent value="worksheets">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : worksheets.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("no_worksheets_yet", lang)}</h3>
                  <p className="text-muted-foreground mb-4">{t("upload_first_worksheet", lang)}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {worksheets.map((ws) => {
                  const wsGames = games[ws.id] || [];
                  const hasGames = wsGames.length > 0;
                  const locked = allLocked(ws.id);
                  const expired = isTermExpired(ws);

                  return (
                    <Card key={ws.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-lg">{ws.title}</CardTitle>
                              {locked && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <Lock className="h-3 w-3" /> QR Locked
                                </Badge>
                              )}
                              {ws.is_public && (
                                <Badge className="gap-1 text-xs bg-primary/10 text-primary border-primary/20">
                                  <Globe className="h-3 w-3" /> Community
                                </Badge>
                              )}
                              {expired && (
                                <Badge variant="destructive" className="gap-1 text-xs">
                                  Term Expired
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mt-0.5">
                              {ws.content_type === "text" ? t("text", lang) : ws.content_type === "image" ? t("image", lang) : t("pdf", lang)}
                              {" · "}
                              {new Date(ws.created_at).toLocaleDateString()}
                              {ws.term_end_date && (
                                <span className={expired ? "text-destructive ml-2" : "ml-2"}>
                                  · Term ends {new Date(ws.term_end_date).toLocaleDateString()}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {hasGames && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQrWorksheet({ ws, games: wsGames })}
                                title={t("print_qr", lang)}
                              >
                                <QrCode className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteWorksheet(ws.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Analysis results */}
                        {analysis(ws) ? (
                          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                {analysis(ws).theme}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-sm">
                                {t("grade", lang)} {analysis(ws).grade_level}
                              </span>
                              {ws.audience_level && (
                                <span className="px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-sm capitalize">
                                  {ws.audience_level}
                                </span>
                              )}
                            </div>
                            {analysis(ws).keywords && (
                              <div className="flex flex-wrap gap-1">
                                {(analysis(ws).keywords as string[]).map((kw: string) => (
                                  <span key={kw} className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                onClick={() => generateGames(ws.id)}
                                disabled={generating === ws.id}
                                className="rounded-xl"
                              >
                                {generating === ws.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Gamepad2 className="h-4 w-4 mr-1" />
                                )}
                                {t("generate_games", lang)}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => analyzeWorksheet(ws.id)}
                                disabled={analyzing === ws.id}
                                className="rounded-xl"
                              >
                                <RefreshCw className={`h-4 w-4 mr-1 ${analyzing === ws.id ? "animate-spin" : ""}`} />
                                {t("re_analyze", lang)}
                              </Button>
                            </div>
                          </div>
                        ) : analyzing === ws.id ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("analyzing_worksheet", lang)}
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => analyzeWorksheet(ws.id)} className="rounded-xl">
                            {t("analyze_worksheet", lang)}
                          </Button>
                        )}

                        {/* ── TERM & SHARING CONTROLS ── */}
                        {hasGames && (
                          <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Distribution Controls</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Term end date */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> Term End Date
                                </label>
                                <Input
                                  type="date"
                                  defaultValue={ws.term_end_date || ""}
                                  className="h-8 text-sm rounded-lg"
                                  onBlur={(e) => {
                                    if (e.target.value !== (ws.term_end_date || "")) {
                                      setTermEndDate(ws.id, e.target.value);
                                    }
                                  }}
                                />
                                <p className="text-xs text-muted-foreground">Games stay active until this date</p>
                              </div>

                              {/* Lock QR codes */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground flex items-center gap-1">
                                  <Lock className="h-3 w-3" /> Lock QR Codes
                                </label>
                                <div className="flex items-center gap-2 pt-1">
                                  {locked ? (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Lock className="h-4 w-4 text-primary" />
                                      <span className="text-primary font-medium">QR codes are locked</span>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => lockQRCodes(ws.id)}
                                      disabled={locking === ws.id}
                                      className="rounded-lg h-8 text-xs gap-1"
                                    >
                                      {locking === ws.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Lock className="h-3 w-3" />
                                      )}
                                      Lock for Term
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {locked
                                    ? "Share codes are fixed — QR prints remain valid"
                                    : "Fix share codes so printed QR codes never break"}
                                </p>
                              </div>

                              {/* Community sharing */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" /> Community Bank
                                </label>
                                <div className="flex items-center gap-2 pt-1">
                                  <Switch
                                    checked={ws.is_public}
                                    onCheckedChange={(v) => toggleCommunityShare(ws, v)}
                                  />
                                  <span className="text-sm text-foreground">
                                    {ws.is_public ? "Shared publicly" : "Private"}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {ws.is_public
                                    ? "Other teachers can discover & play your games"
                                    : "Only you can access these games"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Games list */}
                        {hasGames && (
                          <div className="space-y-2 pt-1">
                            <h4 className="font-display font-semibold text-sm text-foreground">{t("games", lang)}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {wsGames.map((game) => (
                                <div
                                  key={game.id}
                                  className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg shrink-0">
                                      {GAME_EMOJIS[game.game_type] || "🧩"}
                                    </span>
                                    <div className="min-w-0">
                                      <span className="font-semibold text-sm capitalize text-foreground block truncate">
                                        {game.game_type.replace(/_/g, " ")}
                                      </span>
                                      {game.share_code_locked && (
                                        <span className="text-xs text-primary flex items-center gap-0.5">
                                          <Lock className="h-2.5 w-2.5" /> locked
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    {isPrintable(game.game_type) && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setPrintGame({ game, title: ws.title })}
                                        className="rounded-lg text-xs"
                                        title="Print worksheet"
                                      >
                                        <Printer className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setPreviewGame(game)}
                                      className="rounded-lg text-xs"
                                      title={t("teacher_preview", lang)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => navigate(`/leaderboard/${game.id}`)}
                                      className="rounded-lg text-xs"
                                      title={t("leaderboard", lang)}
                                    >
                                      <Trophy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => copyShareCode(game.share_code)}
                                      className="rounded-lg text-xs"
                                    >
                                      <Share2 className="h-3 w-3 mr-1" />
                                      {game.share_code}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Upload tab */}
          <TabsContent value="upload">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">{t("upload_worksheet", lang)}</CardTitle>
                  <CardDescription>{t("click_to_upload", lang)} / {t("paste_worksheet_text", lang)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("title_optional", lang)}</label>
                    <Input
                      placeholder={t("title_placeholder", lang)}
                      value={worksheetTitle}
                      onChange={(e) => setWorksheetTitle(e.target.value)}
                    />
                  </div>

                  {/* File upload */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold text-foreground mb-1">{t("click_to_upload", lang)}</p>
                    <p className="text-sm text-muted-foreground">{t("image_or_pdf", lang)}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">{t("or", lang)}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Text paste */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      {t("paste_worksheet_text", lang)}
                    </label>
                    <Textarea
                      placeholder={t("paste_content_here", lang)}
                      rows={6}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleTextUpload}
                    disabled={!textContent.trim() || uploading}
                    className="w-full rounded-xl"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {t("upload_and_analyze", lang)}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings tab */}
          <TabsContent value="settings">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="font-display">{t("teacher_settings", lang)}</CardTitle>
                <CardDescription>{t("configure_preferences", lang)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("instruction_language", lang)}</label>
                  <Select value={instructionLanguage} onValueChange={updateLanguage}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t("instruction_language_desc", lang)}
                  </p>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Community Bank
                  </label>
                  <p className="text-xs text-muted-foreground">
                    When you share a worksheet to the Community Bank, other teachers worldwide can discover and play your games. Your games remain yours — sharing can be toggled per-worksheet at any time.
                  </p>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/community")}>
                    <Globe className="h-4 w-4 mr-2" /> Browse Community Bank
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
