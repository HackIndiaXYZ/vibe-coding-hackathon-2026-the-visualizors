import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Brain, Moon, Sun } from 'lucide-react';

import LandingPage from './pages/LandingPage';
import Assessment from './pages/Assessment';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import InteractiveBackground from './components/layout/InteractiveBackground';

// Refined Navbar Component
const Navbar = ({ isDark, toggleTheme }) => (
  <nav className={`border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
    <div className="flex items-center gap-2">
      <Brain className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
      <span className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>NeuroTrace AI</span>
    </div>
    
    <div className="flex items-center gap-6 font-medium text-sm">
      <Link to="/" className={`transition-colors ${isDark ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Home</Link>
      <Link to="/assessment" className={`transition-colors ${isDark ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Take Test</Link>
      <Link to="/dashboard" className={`px-4 py-2 rounded-full transition-colors ${isDark ? 'text-indigo-300 bg-indigo-900/50 hover:bg-indigo-800/50' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}>
        Dashboard
      </Link>
      
      <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  </nav>
);

// ScrollToTop Helper: Ensures when you switch pages, you start at the top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  // Check local storage so the theme survives a page refresh!
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  // The Global DOM Enforcer
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617'; // slate-950
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc'; // slate-50
    }
  }, [isDark]);

  return (
    <Router>
      <ScrollToTop />
      {/* THE MASTER WRAPPER: Forces tailwind's dark mode to cascade down */}
      <div className={isDark ? 'dark' : ''}>
        <InteractiveBackground isDark={isDark}>
          <Navbar isDark={isDark} toggleTheme={toggleTheme} />
          
          <Routes>
            <Route path="/" element={<LandingPage isDark={isDark} />} />
            <Route path="/assessment" element={<Assessment isDark={isDark} />} />
            <Route path="/dashboard" element={<AnalyticsDashboard isDark={isDark} />} />
          </Routes>
          
        </InteractiveBackground>
      </div>
    </Router>
  );
}

export default App;