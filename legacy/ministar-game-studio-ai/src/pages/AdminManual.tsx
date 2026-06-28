import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Gamepad2 } from "lucide-react";

const AdminManual = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !contentRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ministar Game Studio - Administrator Manual</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; line-height: 1.7; padding: 40px 60px; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 28px; color: #6c3baa; margin-bottom: 8px; border-bottom: 3px solid #6c3baa; padding-bottom: 12px; }
          h2 { font-size: 22px; color: #6c3baa; margin-top: 36px; margin-bottom: 12px; border-bottom: 1px solid #e0d4f0; padding-bottom: 6px; }
          h3 { font-size: 17px; color: #333; margin-top: 20px; margin-bottom: 8px; }
          p { margin-bottom: 10px; font-size: 14px; }
          ul, ol { margin-left: 24px; margin-bottom: 12px; }
          li { margin-bottom: 6px; font-size: 14px; }
          .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
          .section { page-break-inside: avoid; }
          .tip { background: #f3eeff; border-left: 4px solid #6c3baa; padding: 10px 14px; margin: 12px 0; border-radius: 4px; font-size: 13px; }
          .warning { background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px 14px; margin: 12px 0; border-radius: 4px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          th { background: #f3eeff; color: #6c3baa; }
          .toc { background: #f9f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .toc a { color: #6c3baa; text-decoration: none; }
          .toc li { margin-bottom: 4px; }
          @media print { body { padding: 20px 40px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        ${contentRef.current.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Admin <span className="text-primary">Manual</span>
          </span>
        </div>
        <Button onClick={handleDownloadPDF} className="rounded-xl">
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <div ref={contentRef}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#6c3baa", borderBottom: "3px solid #6c3baa", paddingBottom: "12px", marginBottom: "8px" }}>
            Ministar Game Studio — Administrator Manual
          </h1>
          <p className="subtitle" style={{ color: "#666", fontSize: "14px", marginBottom: "30px" }}>
            Version 1.0 · Last updated: March 2026 · Confidential
          </p>

          {/* TABLE OF CONTENTS */}
          <div style={{ background: "#f9f7ff", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
            <h3 style={{ fontSize: "17px", marginBottom: "10px" }}>Table of Contents</h3>
            <ol style={{ marginLeft: "24px", fontSize: "14px" }}>
              <li>Getting Started & Logging In</li>
              <li>Dashboard Overview</li>
              <li>Uploading Worksheets</li>
              <li>Analyzing Worksheets with AI</li>
              <li>Generating Games</li>
              <li>Managing Games & Share Codes</li>
              <li>QR Code Worksheets</li>
              <li>Locking QR Codes for a Term</li>
              <li>Community Sharing</li>
              <li>Printable Worksheets</li>
              <li>Analytics & Reports</li>
              <li>Blog Manager</li>
              <li>Student Experience</li>
              <li>Leaderboards</li>
              <li>Language Settings</li>
              <li>Game Types Reference</li>
              <li>Troubleshooting</li>
            </ol>
          </div>

          {/* SECTION 1 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            1. Getting Started & Logging In
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Navigate to the application URL and click <strong>"Get Started"</strong> on the landing page. You will be redirected to the authentication page.
          </p>
          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Creating an Account</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>"Sign Up"</strong> tab on the auth page.</li>
            <li>Enter your email address and choose a secure password.</li>
            <li>Optionally enter a display name.</li>
            <li>Click <strong>"Create Account"</strong>.</li>
            <li>Check your email inbox for a verification email and click the confirmation link.</li>
            <li>Return to the app and log in with your credentials.</li>
          </ol>
          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Logging In</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Go to the <strong>"Sign In"</strong> tab.</li>
            <li>Enter your email and password.</li>
            <li>Click <strong>"Sign In"</strong>. You will be redirected to the Dashboard.</li>
          </ol>
          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Resetting Your Password</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>On the Sign In page, click <strong>"Forgot your password?"</strong>.</li>
            <li>Enter your email address and submit.</li>
            <li>Check your inbox for a password reset link.</li>
            <li>Click the link and enter your new password.</li>
          </ol>

          {/* SECTION 2 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            2. Dashboard Overview
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            The Dashboard is your central hub. It contains three main tabs:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", margin: "12px 0", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Tab</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}><strong>Upload</strong></td>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>Upload new worksheets (text, image, or PDF)</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}><strong>My Worksheets</strong></td>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>View, manage, and generate games from existing worksheets</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}><strong>Create</strong></td>
                <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>Paste text content to create worksheets quickly</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            The top navigation bar also provides quick access to:
          </p>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li><strong>Analytics</strong> — View statistics and charts about your games and students</li>
            <li><strong>Blog Manager</strong> — Create and manage blog posts</li>
            <li><strong>Community</strong> — Browse publicly shared games from other teachers</li>
            <li><strong>Sign Out</strong> — Log out of your account</li>
          </ul>

          {/* SECTION 3 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            3. Uploading Worksheets
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            You can upload content in three formats:
          </p>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Option A: Text Input</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Go to the <strong>"Upload"</strong> tab (or "Create" tab).</li>
            <li>Enter a <strong>Worksheet Title</strong> in the title field.</li>
            <li>Paste or type your worksheet content into the large text area.</li>
            <li>Select an <strong>Instruction Language</strong> (English, Japanese, Spanish, French, Korean, Chinese, Portuguese, or Arabic).</li>
            <li>Click <strong>"Upload Text"</strong>.</li>
            <li>The system will automatically begin AI analysis.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Option B: Image Upload</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>"Upload Image / PDF"</strong> button.</li>
            <li>Select a photo or scan of your physical worksheet (JPG, PNG, etc.).</li>
            <li>The AI will read the image using OCR and extract the content.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Option C: PDF Upload</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>"Upload Image / PDF"</strong> button.</li>
            <li>Select a PDF file of your worksheet.</li>
            <li>The AI will extract text from the PDF for analysis.</li>
          </ol>

          <div style={{ background: "#f3eeff", borderLeft: "4px solid #6c3baa", padding: "10px 14px", margin: "12px 0", borderRadius: "4px", fontSize: "13px" }}>
            <strong>💡 Tip:</strong> Give your worksheets clear, descriptive titles. This helps you find them later and makes the AI analysis more accurate.
          </div>

          {/* SECTION 4 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            4. Analyzing Worksheets with AI
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            After uploading, the system automatically triggers an AI analysis. This process:
          </p>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Identifies the <strong>subject area</strong> (e.g., English, Math, Science)</li>
            <li>Detects the <strong>audience level</strong> (e.g., Elementary, Middle School, High School)</li>
            <li>Extracts key <strong>vocabulary, concepts, and questions</strong> from the content</li>
            <li>Prepares structured data for game generation</li>
          </ul>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            If analysis does not trigger automatically, click the <strong>"Re-analyze"</strong> button (🔄) on the worksheet card.
          </p>
          <div style={{ background: "#fff3e0", borderLeft: "4px solid #ff9800", padding: "10px 14px", margin: "12px 0", borderRadius: "4px", fontSize: "13px" }}>
            <strong>⚠️ Note:</strong> Analysis typically takes 15-30 seconds. Please wait for it to complete before generating games.
          </div>

          {/* SECTION 5 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            5. Generating Games
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Once a worksheet has been analyzed, you can generate interactive games:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Find your worksheet in the <strong>"My Worksheets"</strong> tab.</li>
            <li>Look for the analysis summary (subject area, audience level, etc.).</li>
            <li>Click the <strong>"Generate Games"</strong> button (🎮).</li>
            <li>Wait for the AI to create up to <strong>20 different game types</strong> from your content.</li>
            <li>Once complete, game cards will appear below the worksheet.</li>
          </ol>
          <div style={{ background: "#f3eeff", borderLeft: "4px solid #6c3baa", padding: "10px 14px", margin: "12px 0", borderRadius: "4px", fontSize: "13px" }}>
            <strong>💡 Tip:</strong> Game generation may take 1-2 minutes as the AI creates multiple game types. A loading indicator will show progress.
          </div>

          {/* SECTION 6 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            6. Managing Games & Share Codes
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Each generated game gets a unique <strong>share code</strong> (e.g., "abc123"). Students use this code to play the game.
          </p>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Sharing a Game</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Find the game card under your worksheet.</li>
            <li>Click the <strong>share code</strong> to copy it to your clipboard.</li>
            <li>Share the code with students verbally, on a projector, or via messaging.</li>
            <li>Students go to the <strong>Play</strong> page, enter the code, and start playing.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Previewing a Game</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>Eye icon</strong> (👁) on any game card.</li>
            <li>A preview window opens showing the game exactly as students will see it.</li>
            <li>Test all questions, scoring, and interactions before sharing.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Deleting Worksheets & Games</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>Trash icon</strong> (🗑) on a worksheet card.</li>
            <li>Confirm the deletion in the popup dialog.</li>
            <li><strong>Warning:</strong> Deleting a worksheet also deletes all associated games and leaderboard entries.</li>
          </ol>

          {/* SECTION 7 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            7. QR Code Worksheets
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Generate a printable QR code sheet linking to all games for a worksheet:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click the <strong>QR Code icon</strong> on a worksheet card.</li>
            <li>A sheet will generate with QR codes for every game.</li>
            <li>Print the sheet and distribute to students or post in your classroom.</li>
            <li>Students scan the QR code with their phone camera to launch the game instantly.</li>
          </ol>

          {/* SECTION 8 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            8. Locking QR Codes for a Term
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            To prevent share codes from changing when you regenerate games:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Set a <strong>Term End Date</strong> on the worksheet card using the calendar picker.</li>
            <li>Click the <strong>Lock icon</strong> (🔒) to lock all share codes.</li>
            <li>Once locked, regenerating games will preserve existing share codes so your printed QR sheets remain valid.</li>
            <li>After the term ends, you can unlock and regenerate new games.</li>
          </ol>
          <div style={{ background: "#fff3e0", borderLeft: "4px solid #ff9800", padding: "10px 14px", margin: "12px 0", borderRadius: "4px", fontSize: "13px" }}>
            <strong>⚠️ Important:</strong> Locked share codes cannot be changed until you unlock them. This is by design to protect printed QR materials.
          </div>

          {/* SECTION 9 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            9. Community Sharing
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Share your worksheets and games with other teachers:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Find the <strong>"Community"</strong> toggle (🌐) on a worksheet card.</li>
            <li>Switch it <strong>ON</strong> to add all games from that worksheet to the Community Bank.</li>
            <li>Other teachers can browse and use your games from the <strong>Community</strong> page.</li>
            <li>Switch it <strong>OFF</strong> to make your games private again.</li>
          </ol>

          {/* SECTION 10 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            10. Printable Worksheets
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Some game types support printing as traditional paper worksheets:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Look for the <strong>Printer icon</strong> (🖨) on game cards.</li>
            <li>Click it to open a print-optimized version of the game content.</li>
            <li>Use your browser's print dialog (Ctrl/Cmd + P) to print or save as PDF.</li>
            <li>Supported game types: Word Search, Crossword, Fill in the Blank, and more.</li>
          </ol>

          {/* SECTION 11 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            11. Analytics & Reports
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Access the Analytics page from the Dashboard navigation bar:
          </p>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li><strong>Total Worksheets</strong> — Number of worksheets you've created</li>
            <li><strong>Total Games</strong> — Number of games generated across all worksheets</li>
            <li><strong>Total Plays</strong> — How many times students have played your games</li>
            <li><strong>Total Students</strong> — Unique student players</li>
            <li><strong>Game Type Breakdown</strong> — Pie chart showing which game types are most popular</li>
            <li><strong>Content Type Breakdown</strong> — Pie chart of text vs. image vs. PDF uploads</li>
            <li><strong>Recent Activity</strong> — Line chart showing games and plays over time</li>
            <li><strong>Top Games</strong> — Table of your most played games with average scores</li>
          </ul>

          {/* SECTION 12 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            12. Blog Manager
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Create and manage blog posts for your educational community:
          </p>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Generating a Blog Post with AI</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Navigate to <strong>Blog Manager</strong> from the Dashboard.</li>
            <li>Go to the <strong>"AI Generate"</strong> tab.</li>
            <li>Enter a <strong>topic or title idea</strong> (e.g., "5 ways to gamify vocabulary homework").</li>
            <li>Select a <strong>category</strong>: Tips & Tricks, Updates, Features, or Guides.</li>
            <li>Click <strong>"Generate Blog Post"</strong>.</li>
            <li>The AI will create a full blog post (800-1500 words) and save it as a draft.</li>
            <li>The editor will open automatically for you to review.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Editing a Blog Post</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Go to the <strong>"My Posts"</strong> tab.</li>
            <li>Click the <strong>Edit icon</strong> (✏️) on any post.</li>
            <li>Modify the <strong>title</strong>, <strong>excerpt</strong> (preview text), <strong>category</strong>, and <strong>content</strong>.</li>
            <li>Content supports <strong>Markdown</strong> formatting (## headings, **bold**, - lists).</li>
            <li>The word count and estimated reading time update in real-time.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Publishing a Blog Post</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>In the editor, toggle the <strong>"Published" switch</strong> in the top-right corner.</li>
            <li>Click <strong>"Publish"</strong> to make the post live on the public blog.</li>
            <li>To unpublish, toggle the switch back to "Draft" and save.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Deleting a Blog Post</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>In the <strong>"My Posts"</strong> tab, click the <strong>Trash icon</strong> (🗑).</li>
            <li>Confirm deletion. This action cannot be undone.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Viewing the Public Blog</h3>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Click <strong>"View Blog"</strong> in the Blog Manager header.</li>
            <li>The public blog shows all published posts with category filters.</li>
            <li>Each post has its own page at <code>/blog/[slug]</code>.</li>
          </ol>

          {/* SECTION 13 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            13. Student Experience
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Students do <strong>not</strong> need an account. Here's how they access games:
          </p>
          <ol style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Go to the <strong>"Play a Game"</strong> page (accessible from the landing page).</li>
            <li>Enter the <strong>share code</strong> provided by their teacher.</li>
            <li>On first play, students enter a <strong>player name</strong> and choose an <strong>avatar</strong>.</li>
            <li>Their profile is saved on their device (no login required).</li>
            <li>Students earn <strong>XP</strong>, level up, and build streaks as they play.</li>
          </ol>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Student Profile</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Students can view their profile at <strong>/profile</strong>.</li>
            <li>Profile shows: player name, avatar, level, XP, total games played, accuracy stats, and best streak.</li>
            <li>Profile data is stored per-device using a unique device ID.</li>
          </ul>

          {/* SECTION 14 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            14. Leaderboards
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Every game has a built-in leaderboard:
          </p>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>After completing a game, students can submit their score.</li>
            <li>Click the <strong>Trophy icon</strong> (🏆) on any game card to view its leaderboard.</li>
            <li>Leaderboard shows: rank, player name, score, and time taken.</li>
            <li>Accessible at <code>/leaderboard/[gameId]</code>.</li>
          </ul>

          {/* SECTION 15 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            15. Language Settings
          </h2>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            The application supports multiple instruction languages:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", margin: "12px 0", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Language</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Code</th>
              </tr>
            </thead>
            <tbody>
              {[["English", "en"], ["Japanese", "ja"], ["Spanish", "es"], ["French", "fr"], ["Korean", "ko"], ["Chinese", "zh"], ["Portuguese", "pt"], ["Arabic", "ar"]].map(([lang, code]) => (
                <tr key={code}>
                  <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>{lang}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}><code>{code}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Change your language preference from the <strong>language dropdown</strong> in the Dashboard header. This affects UI labels, game instructions, and AI-generated content.
          </p>

          {/* SECTION 16 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            16. Game Types Reference
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", margin: "12px 0", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>#</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Game</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 12px", background: "#f3eeff", color: "#6c3baa" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "🎯 Quiz", "Multiple choice questions with 4 options per question"],
                ["2", "✏️ Spelling", "Listen to audio and spell the word correctly"],
                ["3", "✅ True or False", "Decide if statements are true or false"],
                ["4", "🧩 Matching", "Drag items to match related pairs"],
                ["5", "🃏 Memory", "Flip cards to find matching pairs"],
                ["6", "📦 Group Sort", "Sort items into the correct categories"],
                ["7", "📝 Fill in the Blank", "Type the missing word in sentences"],
                ["8", "🔍 Word Search", "Find hidden words in a letter grid"],
                ["9", "🪢 Hangman", "Guess letters to reveal the hidden word"],
                ["10", "⌨️ Typing Race", "Type words as fast as possible against a timer"],
                ["11", "🔨 Whack-a-Mole", "Tap the correct answer before it disappears"],
                ["12", "🏗️ Sentence Builder", "Arrange words in the correct order"],
                ["13", "🎈 Balloon Pop", "Pop balloons showing correct answers"],
                ["14", "💡 Flashcards", "Study with flip cards showing terms and definitions"],
                ["15", "🪜 Word Ladder", "Transform words step by step"],
                ["16", "🔮 Odd One Out", "Find the item that doesn't belong"],
                ["17", "🏃 Scramble Race", "Unscramble letters to form words"],
                ["18", "🧩 Crossword", "Fill in the crossword puzzle from clues"],
                ["19", "🏆 Jeopardy!", "Category-based quiz show format"],
                ["20", "🎧 Dictation", "Listen and rebuild sentences from scrambled words"],
              ].map(([num, name, desc]) => (
                <tr key={num}>
                  <td style={{ border: "1px solid #ddd", padding: "8px 12px", textAlign: "center" }}>{num}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>{name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SECTION 17 */}
          <h2 style={{ fontSize: "22px", color: "#6c3baa", marginTop: "36px", marginBottom: "12px", borderBottom: "1px solid #e0d4f0", paddingBottom: "6px" }}>
            17. Troubleshooting
          </h2>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Game generation is taking too long</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Game generation typically takes 1-2 minutes for 20 game types.</li>
            <li>If it exceeds 3 minutes, try refreshing the page and clicking "Generate Games" again.</li>
            <li>Ensure your worksheet has sufficient content (at least 5-10 vocabulary items or questions).</li>
          </ul>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Students can't find the game</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Verify the share code is correct (case-sensitive).</li>
            <li>Ensure the game hasn't been deleted or regenerated with a new code.</li>
            <li>If QR codes are locked, the codes should remain stable.</li>
          </ul>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Blog post not showing on public blog</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Ensure the post's <strong>"Published" toggle</strong> is turned ON.</li>
            <li>Click <strong>"Publish"</strong> (not "Save Draft") to make it live.</li>
            <li>Refresh the public blog page to see the latest posts.</li>
          </ul>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Analysis failed or returned incorrect results</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>Re-analyze the worksheet by clicking the refresh button.</li>
            <li>For image uploads, ensure the image is clear and well-lit.</li>
            <li>Try uploading the content as text instead if OCR struggles with your handwriting.</li>
          </ul>

          <h3 style={{ fontSize: "17px", marginTop: "20px", marginBottom: "8px" }}>Non-English characters appearing in games</h3>
          <ul style={{ marginLeft: "24px", fontSize: "14px", marginBottom: "12px" }}>
            <li>The system automatically sanitizes game content to ASCII characters.</li>
            <li>If you notice foreign characters, try regenerating the games.</li>
            <li>Ensure your instruction language is set correctly.</li>
          </ul>

          <div style={{ marginTop: "48px", paddingTop: "20px", borderTop: "2px solid #e0d4f0", textAlign: "center", color: "#999", fontSize: "12px" }}>
            <p>© 2026 Ministar Game Studio. All rights reserved.</p>
            <p>This manual is confidential and intended for administrators only.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManual;
