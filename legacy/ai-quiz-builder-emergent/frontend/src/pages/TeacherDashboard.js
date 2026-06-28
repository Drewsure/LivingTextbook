import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/App";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { 
  FileText, Upload, Sparkles, Users, BarChart3, Trophy, 
  LogOut, Plus, Download, Share2, Eye, Loader2, RotateCcw, Printer, QrCode, Play, X,
  Star, CheckSquare, Square, Zap, PieChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { Checkbox } from "@/components/ui/checkbox";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { gameThemes } from "@/utils/gameThemes";

export default function TeacherDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [worksheets, setWorksheets] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // file or text
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [instructionLanguage, setInstructionLanguage] = useState("ja");
  const [analyzing, setAnalyzing] = useState(false);
  const [currentWorksheet, setCurrentWorksheet] = useState(null);
  const [gameDialog, setGameDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [generatingGames, setGeneratingGames] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [previewGame, setPreviewGame] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedWorksheets, setSelectedWorksheets] = useState([]);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [gamesTab, setGamesTab] = useState("all"); // "all" or "favorites"
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("auto"); // Theme selector

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: handleFileDrop
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, worksheetsRes, gamesRes] = await Promise.all([
        api.get('/teacher/stats'),
        api.get('/worksheets'),
        api.get('/games/teacher')
      ]);
      setStats(statsRes.data);
      setWorksheets(worksheetsRes.data);
      setGames(gamesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  }

  async function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setLoading(true);
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      
      const response = await api.post('/worksheets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCurrentWorksheet(response.data);
      toast.success('Worksheet analyzed successfully!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload worksheet');
    }
    setLoading(false);
    setAnalyzing(false);
  }

  async function handleTextSubmit() {
    if (!textContent.trim() || !textTitle.trim()) {
      toast.error('Please provide both title and content');
      return;
    }
    
    setLoading(true);
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('text', textContent);
      formData.append('title', textTitle);
      formData.append('instruction_language', instructionLanguage);
      
      const response = await api.post('/worksheets/analyze-text', formData);
      
      setCurrentWorksheet(response.data);
      setTextContent('');
      setTextTitle('');
      toast.success('Content analyzed successfully!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to analyze content');
    }
    setLoading(false);
    setAnalyzing(false);
  }

  async function handleReanalyze() {
    if (!currentWorksheet) return;
    
    setAnalyzing(true);
    try {
      const response = await api.post(`/worksheets/${currentWorksheet.id}/reanalyze`);
      setCurrentWorksheet(response.data);
      toast.success('Re-analyzed successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to re-analyze');
    }
    setAnalyzing(false);
  }

  async function generateGames(worksheet) {
    setGeneratingGames(true);
    try {
      const gameTypes = worksheet.analysis?.suggested_games || ['Word Match', 'Quiz', 'Flashcards', 'Spelling Practice'];
      const keywords = worksheet.analysis?.keywords || [];
      
      for (let i = 0; i < Math.min(gameTypes.length, 6); i++) {
        const gameType = gameTypes[i];
        const gameContent = generateGameContent(gameType, keywords, worksheet);
        
        // Add selected theme to game content
        gameContent.selectedTheme = selectedTheme !== 'auto' ? selectedTheme : null;
        
        await api.post('/games/create', {
          worksheet_id: worksheet.id,
          title: `${gameType} - ${worksheet.analysis?.theme || 'Practice'}`,
          game_type: gameType,
          content: gameContent,
          grade_level: worksheet.analysis?.grade_level,
          theme: worksheet.analysis?.theme
        });
      }
      
      toast.success(`Generated ${Math.min(gameTypes.length, 6)} games!`);
      loadData();
    } catch (error) {
      toast.error('Failed to generate games');
    }
    setGeneratingGames(false);
  }

  async function handlePrintQrWorksheet(worksheet) {
    setDownloadingPdf(true);
    try {
      const response = await api.get(`/worksheets/${worksheet.id}/print-qr`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ministar_games_${worksheet.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('QR Worksheet PDF downloaded!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to generate PDF. Make sure you have generated games first!';
      toast.error(message);
    }
    setDownloadingPdf(false);
  }

  async function handleBatchGenerate() {
    if (selectedWorksheets.length === 0) {
      toast.error('Please select at least one worksheet');
      return;
    }
    
    setBatchGenerating(true);
    let successCount = 0;
    let failCount = 0;
    
    for (const worksheetId of selectedWorksheets) {
      const worksheet = worksheets.find(w => w.id === worksheetId);
      if (!worksheet || !worksheet.analysis) {
        failCount++;
        continue;
      }
      
      try {
        await generateGames(worksheet);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }
    
    setBatchGenerating(false);
    setSelectedWorksheets([]);
    setBatchMode(false);
    
    if (successCount > 0) {
      toast.success(`Generated games for ${successCount} worksheet(s)!`);
    }
    if (failCount > 0) {
      toast.error(`Failed to generate for ${failCount} worksheet(s)`);
    }
    
    loadData();
  }

  function toggleWorksheetSelection(worksheetId) {
    setSelectedWorksheets(prev => 
      prev.includes(worksheetId) 
        ? prev.filter(id => id !== worksheetId)
        : [...prev, worksheetId]
    );
  }

  async function toggleFavorite(gameId) {
    try {
      const response = await api.post(`/games/${gameId}/favorite`);
      setGames(prev => prev.map(g => 
        g.id === gameId ? { ...g, is_favorite: response.data.is_favorite } : g
      ));
      toast.success(response.data.is_favorite ? 'Added to favorites!' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  }

  const filteredGames = gamesTab === 'favorites' 
    ? games.filter(g => g.is_favorite) 
    : games;

  function generateGameContent(gameType, keywords, worksheet) {
    const theme = worksheet.analysis?.theme || 'General';
    const imageKeywords = worksheet.analysis?.image_keywords || keywords;
    
    // Create contextual examples based on actual theme and keywords
    const createExample = (word) => {
      if (theme.toLowerCase() === 'pronouns') {
        const examples = {
          'i': 'I am a student',
          'you': 'You are my friend',
          'he': 'He is a boy',
          'she': 'She is a girl',
          'it': 'It is a cat',
          'we': 'We are learning',
          'they': 'They are playing'
        };
        return examples[word.toLowerCase()] || `${word} in a sentence`;
      } else if (theme.toLowerCase() === 'colors') {
        return `The color ${word}`;
      } else if (theme.toLowerCase() === 'animals') {
        return `This is a ${word}`;
      }
      return `Example with ${word}`;
    };

    const getDistractors = (correctWord, allWords) => {
      const others = allWords.filter(w => w.toLowerCase() !== correctWord.toLowerCase());
      const shuffled = others.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    };
    
    switch(gameType) {
      case 'Word Match':
        return {
          pairs: keywords.slice(0, 8).map((word, i) => ({
            id: i,
            word: word,
            match: createExample(word),
            imageKeyword: imageKeywords[i] || word
          }))
        };
      
      case 'Quiz':
      case 'Gameshow quiz':
        return {
          questions: keywords.slice(0, 10).map((word, i) => {
            const distractors = getDistractors(word, keywords);
            const correctAnswer = createExample(word);
            const wrongAnswers = distractors.map(d => createExample(d));
            const allOptions = [correctAnswer, ...wrongAnswers];
            const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
            
            return {
              id: i,
              question: `What is ${word}?`,
              word: word,
              imageKeyword: imageKeywords[i] || word,
              options: shuffledOptions,
              correct: shuffledOptions.indexOf(correctAnswer)
            };
          })
        };
      
      case 'Flashcards':
        return {
          cards: keywords.map((word, i) => ({
            id: i,
            front: word,
            back: createExample(word),
            imageKeyword: imageKeywords[i] || word
          }))
        };
      
      case 'Spelling Practice':
        return {
          words: keywords,
          imageKeywords: imageKeywords,
          hints: keywords.map(word => `Listen and spell the word`)
        };
      
      case 'Word Search':
        return {
          words: keywords.slice(0, 12),
          gridSize: 12
        };
      
      case 'Matching Pairs':
        return {
          pairs: keywords.slice(0, 8).map((word, i) => ({
            id: i,
            content: word,
            pair_id: i,
            imageKeyword: imageKeywords[i] || word
          }))
        };
      
      case 'Fill in the Blank':
      case 'Complete the sentence':
        return {
          sentences: keywords.map((word, i) => ({
            sentence: `_____ is a ${theme.toLowerCase()}.`,
            answer: word,
            hint: `Think about ${theme}`,
            imageKeyword: imageKeywords[i] || word
          }))
        };
      
      case 'True or False':
        return {
          statements: keywords.map((word, i) => ({
            id: i,
            statement: `${word} is a ${theme.toLowerCase()}`,
            answer: true,
            imageKeyword: imageKeywords[i] || word
          }))
        };
      
      case 'Word Climber':
        return {
          words: keywords.slice(0, 8),
          theme: theme,
          keywords: keywords,
          imageKeywords: imageKeywords
        };
      
      default:
        return { keywords, theme, imageKeywords };
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    toast.success('Logged out successfully');
  }

  return (
    <div className="min-h-screen bg-slate-50 teacher-theme">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Ministar Game Studio</h1>
              <p className="text-sm text-slate-600">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(true)}
              className="border-2 border-violet-300 text-violet-700 hover:bg-violet-50"
              data-testid="open-analytics-button"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="logout-button">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Active Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-teal-600">{stats.active_students}</div>
                  <Users className="w-8 h-8 text-teal-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Worksheets Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-violet-600">{stats.worksheets_created}</div>
                  <FileText className="w-8 h-8 text-violet-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-pink-600">{stats.games_played}</div>
                  <Trophy className="w-8 h-8 text-pink-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-teal-600">{stats.average_engagement}%</div>
                  <BarChart3 className="w-8 h-8 text-teal-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Batch Generate Section */}
        {worksheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className={`border-2 transition-all ${batchMode ? 'border-violet-400 bg-violet-50' : 'border-slate-200'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${batchMode ? 'bg-violet-600' : 'bg-slate-100'}`}>
                      <Zap className={`w-5 h-5 ${batchMode ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Batch Generate Games</h3>
                      <p className="text-sm text-slate-500">
                        {batchMode 
                          ? `${selectedWorksheets.length} worksheet(s) selected` 
                          : 'Generate games for multiple worksheets at once'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {batchMode ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setBatchMode(false);
                            setSelectedWorksheets([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleBatchGenerate}
                          disabled={selectedWorksheets.length === 0 || batchGenerating}
                          className="bg-violet-600 hover:bg-violet-700"
                          data-testid="batch-generate-execute"
                        >
                          {batchGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate ({selectedWorksheets.length})
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-2 border-violet-300 text-violet-700 hover:bg-violet-50"
                        onClick={() => setBatchMode(true)}
                        data-testid="batch-generate-start"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Start Batch Mode
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Worksheet Selection List */}
                {batchMode && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-slate-600 mb-3">Select worksheets to generate games for:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
                      {worksheets.filter(w => w.analysis).map((worksheet) => (
                        <div
                          key={worksheet.id}
                          onClick={() => toggleWorksheetSelection(worksheet.id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            selectedWorksheets.includes(worksheet.id)
                              ? 'border-violet-500 bg-violet-100'
                              : 'border-slate-200 hover:border-violet-300'
                          }`}
                          data-testid={`batch-select-${worksheet.id}`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedWorksheets.includes(worksheet.id)
                              ? 'bg-violet-600 border-violet-600'
                              : 'border-slate-300'
                          }`}>
                            {selectedWorksheets.includes(worksheet.id) && (
                              <CheckSquare className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{worksheet.title}</p>
                            <p className="text-xs text-slate-500">{worksheet.analysis?.theme}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {worksheets.filter(w => w.analysis).length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No analyzed worksheets available. Upload and analyze worksheets first.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Create Worksheet */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-md" data-testid="create-worksheet-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" />
                  Create Games by Uploading Worksheet
                </CardTitle>
                <CardDescription>Submit your worksheet - we'll handle the rest!</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={uploadMode} onValueChange={setUploadMode} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="file" data-testid="upload-file-tab">Upload File</TabsTrigger>
                    <TabsTrigger value="text" data-testid="upload-text-tab">Paste Content</TabsTrigger>
                    <TabsTrigger value="settings" data-testid="teacher-settings-tab">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="file">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400'
                      }`}
                      data-testid="file-dropzone"
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-xs text-slate-500">PDF, DOCX, Images, TXT</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="text">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-title">Worksheet Title</Label>
                        <Input
                          id="text-title"
                          placeholder="My Vocabulary Worksheet"
                          value={textTitle}
                          onChange={(e) => setTextTitle(e.target.value)}
                          data-testid="text-title-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instruction-lang">Instruction Language for Students</Label>
                        <Select value={instructionLanguage} onValueChange={setInstructionLanguage}>
                          <SelectTrigger id="instruction-lang" data-testid="language-selector">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ja">🇯🇵 Japanese (日本語)</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="text-content">Content</Label>
                        <Textarea
                          id="text-content"
                          placeholder="Paste your worksheet content here..."
                          rows={8}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          data-testid="text-content-input"
                        />
                      </div>
                      <Button
                        onClick={handleTextSubmit}
                        disabled={loading || !textContent || !textTitle}
                        className="w-full bg-teal-600 hover:bg-teal-700"
                        data-testid="analyze-text-button"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze Content
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings">
                    <div className="space-y-6 p-4">
                      <div>
                        <Label className="text-lg font-semibold mb-3 block">Default Settings</Label>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="default-instruction-lang">Default Instruction Language</Label>
                            <Select value={instructionLanguage} onValueChange={setInstructionLanguage}>
                              <SelectTrigger id="default-instruction-lang">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ja">🇯🇵 Japanese (日本語)</SelectItem>
                                <SelectItem value="en">🇬🇧 English</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 mt-1">This will be the default language for game instructions</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm text-teal-700 font-medium">✨ Tip: You can always change the language when uploading each worksheet</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {analyzing && (
                  <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm text-teal-700 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI is analyzing your worksheet...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle: Current Worksheet Analysis */}
          <div className="lg:col-span-1">
            {currentWorksheet ? (
              <Card className="border-slate-200 shadow-md" data-testid="worksheet-analysis-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>{currentWorksheet.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentWorksheet.analysis && (
                    <>
                      <div>
                        <Label className="text-xs text-slate-500">Theme</Label>
                        <p className="font-medium text-lg">{currentWorksheet.analysis.theme}</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-500">Grade Level</Label>
                        <p className="font-medium">{currentWorksheet.analysis.grade_level}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-500">Keywords</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentWorksheet.analysis.keywords?.map((keyword, i) => (
                            <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-500">Learning Objectives</Label>
                        <ul className="mt-2 space-y-1">
                          {currentWorksheet.analysis.learning_objectives?.map((obj, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-teal-600 mt-1">•</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Theme Selector */}
                      <div className="p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg border border-violet-200">
                        <Label className="text-sm font-bold text-violet-800 mb-3 block">🎨 Game Visual Theme</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSelectedTheme('auto')}
                            className={`p-2 rounded-lg border-2 transition-all text-center ${
                              selectedTheme === 'auto' 
                                ? 'border-violet-500 bg-violet-100' 
                                : 'border-slate-200 hover:border-violet-300'
                            }`}
                            data-testid="theme-auto"
                          >
                            <span className="text-xl">🤖</span>
                            <p className="text-xs font-medium mt-1">Auto</p>
                          </button>
                          {Object.entries(gameThemes).map(([key, theme]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedTheme(key)}
                              className={`p-2 rounded-lg border-2 transition-all text-center ${
                                selectedTheme === key 
                                  ? 'border-violet-500 bg-violet-100' 
                                  : 'border-slate-200 hover:border-violet-300'
                              }`}
                              data-testid={`theme-${key}`}
                            >
                              <span className="text-xl">{theme.emoji}</span>
                              <p className="text-xs font-medium mt-1">{theme.name.split(' ')[0]}</p>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-violet-600 mt-2">
                          {selectedTheme === 'auto' ? '✨ Theme will be auto-selected based on content' : `Selected: ${gameThemes[selectedTheme]?.name}`}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => generateGames(currentWorksheet)}
                          disabled={generatingGames}
                          className="flex-1 bg-violet-600 hover:bg-violet-700"
                          data-testid="generate-games-button"
                        >
                          {generatingGames ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Games
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleReanalyze}
                          disabled={analyzing}
                          variant="outline"
                          className="border-2 border-violet-300"
                          data-testid="reanalyze-button"
                        >
                          {analyzing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Print QR Worksheet Button */}
                      <Button
                        onClick={() => handlePrintQrWorksheet(currentWorksheet)}
                        disabled={downloadingPdf}
                        variant="outline"
                        className="w-full mt-3 border-2 border-teal-400 text-teal-700 hover:bg-teal-50"
                        data-testid="print-qr-worksheet-button"
                      >
                        {downloadingPdf ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <Printer className="w-4 h-4 mr-2" />
                            Print QR Worksheet
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 shadow-md">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Upload a worksheet to see analysis</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Generated Games */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-md" data-testid="generated-games-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Games</CardTitle>
                    <CardDescription>{games.length} games available</CardDescription>
                  </div>
                </div>
                {/* Games Tab Selector */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant={gamesTab === 'all' ? 'default' : 'outline'}
                    className={gamesTab === 'all' ? 'bg-violet-600 hover:bg-violet-700' : ''}
                    onClick={() => setGamesTab('all')}
                    data-testid="games-tab-all"
                  >
                    All Games
                  </Button>
                  <Button
                    size="sm"
                    variant={gamesTab === 'favorites' ? 'default' : 'outline'}
                    className={gamesTab === 'favorites' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                    onClick={() => setGamesTab('favorites')}
                    data-testid="games-tab-favorites"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Favorites ({games.filter(g => g.is_favorite).length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border rounded-lg hover:shadow-md transition-shadow bg-white ${
                        game.is_favorite ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleFavorite(game.id)}
                            className="mt-0.5 focus:outline-none"
                            data-testid={`favorite-game-${game.id}`}
                          >
                            <Star 
                              className={`w-5 h-5 transition-colors ${
                                game.is_favorite 
                                  ? 'text-amber-500 fill-amber-500' 
                                  : 'text-slate-300 hover:text-amber-400'
                              }`} 
                            />
                          </button>
                          <div>
                            <h4 className="font-medium text-sm">{game.title}</h4>
                            <p className="text-xs text-slate-500">{game.game_type}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                          {game.theme}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                          onClick={() => {
                            setPreviewGame(game);
                            setPreviewMode(true);
                          }}
                          data-testid={`preview-game-${game.id}`}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-violet-300"
                          onClick={() => window.open(`/play/${game.share_code}`, '_blank')}
                          data-testid={`open-game-${game.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2"
                          onClick={() => {
                            setSelectedGame(game);
                            setShareDialog(true);
                          }}
                          data-testid={`share-game-${game.id}`}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Plays: {game.plays || 0}</p>
                    </motion.div>
                  ))}
                  
                  {filteredGames.length === 0 && gamesTab === 'favorites' && (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No favorite games yet</p>
                      <p className="text-slate-400 text-xs mt-1">Click the star icon on any game to add it to favorites</p>
                    </div>
                  )}
                  
                  {games.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No games yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onOpenChange={setShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Game</DialogTitle>
            <DialogDescription>
              Students can access this game using the code or QR code
            </DialogDescription>
          </DialogHeader>
          {selectedGame && (
            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-sm text-slate-600 mb-2 block">Access Code</Label>
                <div className="bg-slate-100 p-4 rounded-lg">
                  <p className="text-4xl font-bold tracking-wider text-teal-600 font-mono">
                    {selectedGame.share_code}
                  </p>
                </div>
              </div>

              {selectedGame.qr_code && (
                <div className="text-center">
                  <Label className="text-sm text-slate-600 mb-2 block">QR Code</Label>
                  <div className="bg-white p-4 border rounded-lg inline-block">
                    <img 
                      src={`data:image/png;base64,${selectedGame.qr_code}`} 
                      alt="QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${selectedGame.qr_code}`;
                      link.download = `game-${selectedGame.share_code}.png`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Preview Mode Modal */}
      {previewMode && previewGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg z-10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-violet-100 p-2 rounded-lg">
                  <Eye className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-800">Teacher Preview Mode</h3>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                      Preview Only
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {previewGame.title} • {previewGame.game_type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-xs text-slate-500">Share Code</p>
                  <p className="font-mono font-bold text-teal-600">{previewGame.share_code}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-teal-400 text-teal-700"
                  onClick={() => {
                    setSelectedGame(previewGame);
                    setPreviewMode(false);
                    setShareDialog(true);
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/play/${previewGame.share_code}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Open Full
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setPreviewMode(false);
                    setPreviewGame(null);
                  }}
                  data-testid="close-preview-button"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          </div>
          
          {/* Game Preview iframe */}
          <div className="pt-20 h-full">
            <iframe
              src={`/play/${previewGame.share_code}`}
              className="w-full h-full border-0"
              title={`Preview: ${previewGame.title}`}
              data-testid="game-preview-iframe"
            />
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  );
}
