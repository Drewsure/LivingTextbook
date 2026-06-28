import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Game = Database["public"]["Tables"]["games"]["Row"];
type Worksheet = Database["public"]["Tables"]["worksheets"]["Row"];

interface QRWorksheetProps {
  worksheet: Worksheet;
  games: Game[];
  baseUrl: string;
  onClose: () => void;
}

const GAME_ICONS: Record<string, string> = {
  quiz: "🎯",
  spelling: "✏️",
  true_false: "✅",
  drag_drop: "🧩",
  memory: "🃏",
  group_sort: "📦",
  fill_blank: "📝",
  word_search: "🔍",
  hangman: "🪢",
  typing_race: "⌨️",
  whack_a_mole: "🔨",
  sentence_builder: "🏗️",
  balloon_pop: "🎈",
  flashcards: "💡",
  word_ladder: "🪜",
  odd_one_out: "🔮",
  scramble_race: "🏃",
  crossword: "🧩",
  jeopardy: "🏆",
  boss_battle: "👾",
  mystery_detective: "🔎",
  matching: "🔗",
};

export function QRWorksheet({ worksheet, games, baseUrl, onClose }: QRWorksheetProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const allGamesUrl = `${baseUrl}/games/${worksheet.id}`;
  const createdDate = format(new Date(worksheet.created_at), "MMM d, yyyy");
  const lockedUntil = worksheet.term_end_date ? format(new Date(worksheet.term_end_date), "MMM d, yyyy") : null;
  const isLocked = games.some((g) => g.share_code_locked);

  // Get AI analysis title if available
  const analysis = worksheet.analysis_results as any;
  const analysisTitle = analysis?.title || analysis?.topic || worksheet.title;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Worksheet - ${analysisTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { 
              size: A4 portrait; 
              margin: 6mm;
            }
            body { 
              font-family: 'Nunito', sans-serif; 
              padding: 0;
              font-size: 11px;
              line-height: 1.2;
              transform: scale(0.86);
              transform-origin: top left;
              width: 116.3%;
            }
            h1, h2, h3 { font-family: 'Fredoka', sans-serif; }
            .page { 
              page-break-after: always;
              min-height: 100%;
            }
            .page:last-child { page-break-after: avoid; }
            .header { 
              display: flex; 
              align-items: center; 
              justify-content: space-between;
              border-bottom: 2px solid #7c3aed; 
              padding-bottom: 10px; 
              margin-bottom: 16px;
            }
            .header-left { display: flex; align-items: center; gap: 12px; }
            .logo { 
              width: 48px; 
              height: 48px; 
              background: linear-gradient(135deg, #7c3aed, #a855f7);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: white;
            }
            .header-title h1 { font-size: 20px; margin-bottom: 2px; color: #1a1a1a; }
            .header-title p { font-size: 11px; color: #666; }
            .header-meta { text-align: right; font-size: 10px; color: #666; }
            .header-meta .date { margin-bottom: 2px; }
            .header-meta .locked { color: #7c3aed; font-weight: 600; }
            .main-qr { 
              text-align: center; 
              margin-bottom: 20px; 
              padding: 16px; 
              border: 2px dashed #7c3aed; 
              border-radius: 12px; 
              background: #faf5ff; 
            }
            .main-qr h2 { font-size: 16px; margin-bottom: 6px; }
            .main-qr p { color: #666; font-size: 11px; margin-bottom: 8px; }
            .main-qr .url { font-size: 9px; color: #999; word-break: break-all; margin-top: 6px; }
            .games-grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 10px;
            }
            .game-card { 
              text-align: center; 
              padding: 10px 6px; 
              border: 1.5px solid #e5e7eb; 
              border-radius: 8px;
              break-inside: avoid;
            }
            .game-card .icon { font-size: 20px; margin-bottom: 3px; }
            .game-card .name { font-family: 'Fredoka'; font-weight: 600; font-size: 10px; margin-bottom: 3px; text-transform: capitalize; }
            .game-card .qr-wrap { margin: 4px 0; }
            .game-card .code { font-family: monospace; font-weight: 700; font-size: 11px; color: #7c3aed; letter-spacing: 1px; margin-top: 3px; }
            .footer { 
              text-align: center; 
              margin-top: 16px; 
              padding-top: 10px;
              border-top: 1px solid #e5e7eb;
              color: #999; 
              font-size: 9px; 
            }
            .footer .brand { font-family: 'Fredoka'; font-weight: 600; color: #7c3aed; }
            @media print { 
              .no-print { display: none !important; } 
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  // Use full A4 portrait space — larger QR codes, well-spaced grid
  const gridCols = games.length > 12 ? 4 : games.length > 6 ? 3 : 2;
  const qrSize = games.length > 12 ? 80 : games.length > 6 ? 100 : 120;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-3xl shadow-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display font-bold text-lg text-foreground">QR Code Worksheet</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="rounded-xl gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="p-6">
          {/* Logo - right aligned */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              borderRadius: 8,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "white",
            }}>
              🎮
            </div>
            <h2 style={{ fontFamily: "Fredoka", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
              Ministar <span style={{ color: "#7c3aed" }}>Game Studio</span>
            </h2>
          </div>

          {/* Header with title and dates */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #7c3aed", paddingBottom: 8, marginBottom: 12 }}>
            <div>
              <h1 style={{ fontFamily: "Fredoka", fontSize: 22, fontWeight: 700, marginBottom: 2, color: "#1a1a1a" }}>{analysisTitle}</h1>
              <p style={{ fontSize: 13, color: "#666" }}>Scan a QR code to play! / QRコードをスキャンしてプレイ!</p>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
              <div>Created: {createdDate}</div>
              {isLocked && lockedUntil && (
                <div style={{ color: "#7c3aed", fontWeight: 600 }}>🔒 Locked until: {lockedUntil}</div>
              )}
              {isLocked && !lockedUntil && (
                <div style={{ color: "#7c3aed", fontWeight: 600 }}>🔒 QR Codes Locked</div>
              )}
            </div>
          </div>

          {/* Main QR - all games - compact */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 14, padding: 10, border: "2px dashed #7c3aed", borderRadius: 10, background: "#faf5ff" }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <h2 style={{ fontFamily: "Fredoka", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🎮 All Games / すべてのゲーム</h2>
              <QRCodeSVG value={allGamesUrl} size={90} level="M" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              {analysis?.subject_area && (
                <span style={{ display: "inline-block", padding: "3px 12px", border: "1.5px solid #7c3aed", borderRadius: 20, fontFamily: "Fredoka", fontWeight: 600, fontSize: 14, color: "#7c3aed" }}>
                  {analysis.subject_area}
                </span>
              )}
              {(worksheet.audience_level || analysis?.grade_level) && (
                <span style={{ display: "inline-block", padding: "3px 12px", border: "1.5px solid #ca8a04", borderRadius: 20, fontFamily: "Fredoka", fontWeight: 600, fontSize: 14, color: "#92400e", background: "#fef9c3" }}>
                  {worksheet.audience_level || analysis?.grade_level}
                </span>
              )}
              {analysis?.keywords && Array.isArray(analysis.keywords) && analysis.keywords.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                  {analysis.keywords.slice(0, 8).map((kw: string, i: number) => (
                    <span key={i} style={{ padding: "2px 8px", background: "#f3f4f6", borderRadius: 12, fontSize: 12, color: "#374151" }}>{kw}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All game QRs - spread across full page */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: 14, flex: 1 }}>
            {games.map((game) => {
              const url = `${baseUrl}/play/${game.share_code}`;
              const icon = GAME_ICONS[game.game_type] || "🎮";
              return (
                <div key={game.id} style={{ textAlign: "center", padding: "12px 8px", border: "1.5px solid #e5e7eb", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 14, marginBottom: 6, textTransform: "capitalize" }}>
                    {game.game_type.replace(/_/g, " ")}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <QRCodeSVG value={url} size={qrSize} level="M" />
                  </div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#7c3aed", letterSpacing: 1.5, marginTop: 6 }}>
                    {game.share_code}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="no-print" style={{ textAlign: "center", marginTop: 12, paddingTop: 8, borderTop: "1px solid #e5e7eb", color: "#999", fontSize: 11 }}>
            <span style={{ fontFamily: "Fredoka", fontWeight: 600, color: "#7c3aed" }}>Ministar Game Studio</span> • ministar.app
          </div>
        </div>
      </div>
    </div>
  );
}
