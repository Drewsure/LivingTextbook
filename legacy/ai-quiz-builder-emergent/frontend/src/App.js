import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import AuthPage from "@/pages/AuthPage";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentPortal from "@/pages/StudentPortal";
import GamePlayer from "@/pages/GamePlayer";
import GamesLandingPage from "@/pages/GamesLandingPage";
import LandingPage from "@/pages/LandingPage";
import StudentProgress from "@/components/StudentProgress";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/auth" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <AuthPage setUser={setUser} />} />
          <Route path="/teacher/*" element={user?.role === 'teacher' ? <TeacherDashboard user={user} setUser={setUser} /> : <Navigate to="/auth" />} />
          <Route path="/student" element={user?.role === 'student' ? <StudentPortal user={user} setUser={setUser} /> : <Navigate to="/auth" />} />
          <Route path="/games/:worksheetId" element={<GamesLandingPage />} />
          <Route path="/play/:code" element={<GamePlayer />} />
          <Route path="/progress" element={<StudentProgress />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;