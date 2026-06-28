import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Target, Zap, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage({ user }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-violet-50">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Ministar Game Studio</span>
          </div>
          <p className="text-sm text-teal-700 font-semibold mt-1">ESL / EFL Tools for Kids with confident, bright futures</p>
          {user ? (
            <Button onClick={() => navigate(user.role === 'teacher' ? '/teacher' : '/student')} className="bg-teal-600 hover:bg-teal-700" data-testid="dashboard-button">
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate('/auth')} className="bg-teal-600 hover:bg-teal-700" data-testid="get-started-button">
              Get Started
            </Button>
          )}
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-br from-teal-500 to-violet-600 p-6 rounded-3xl animate-float">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Transform Worksheets into
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-violet-600 bg-clip-text text-transparent">
              Spectacular Games
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            AI-powered gamified learning for ESL teachers. Upload any worksheet and instantly generate
            engaging interactive games for your students.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700 text-lg h-14 px-8"
              data-testid="hero-get-started-button"
            >
              Start Creating Games
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>AI Analysis</h3>
            <p className="text-slate-600">
              Upload worksheets in any format. Our AI extracts keywords, themes, and learning objectives automatically.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-violet-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>30+ Game Types</h3>
            <p className="text-slate-600">
              From word match to quiz games, spelling practice to crosswords - spectacular interactive games for every learning style.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Easy Sharing</h3>
            <p className="text-slate-600">
              Share games with students via QR codes or simple access codes. Track progress and engagement.
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="border-t bg-white/80 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>© 2026 Ministar Game Studio. ESL / EFL Tools for Kids with confident, bright futures.</p>
        </div>
      </footer>
    </div>
  );
}