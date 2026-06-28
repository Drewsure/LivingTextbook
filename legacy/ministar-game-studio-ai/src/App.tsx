import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { StudentProvider } from "@/lib/student";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import BlogManager from "./pages/BlogManager";
import AdminManual from "./pages/AdminManual";
import Play from "./pages/Play";
import StudentProfile from "./pages/StudentProfile";
import Leaderboard from "./pages/Leaderboard";
import GamesLanding from "./pages/GamesLanding";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    <Route path="/blog-manager" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
    <Route path="/admin-manual" element={<ProtectedRoute><AdminManual /></ProtectedRoute>} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPostPage />} />
    <Route path="/play" element={<Play />} />
    <Route path="/play/:code" element={<Play />} />
    <Route path="/profile" element={<StudentProfile />} />
    <Route path="/leaderboard/:gameId" element={<Leaderboard />} />
    <Route path="/games/:worksheetId" element={<GamesLanding />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/community" element={<Community />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StudentProvider>
            <AppRoutes />
          </StudentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
