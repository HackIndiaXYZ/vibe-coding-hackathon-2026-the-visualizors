import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, ChevronRight, Mail, Send, Activity, Code } from 'lucide-react';

export default function LandingPage({ isDark }) {
  const [formStatus, setFormStatus] = useState('idle');

  // THE CONSISTENCY METHOD: 
  // Guarantees perfect styling by strictly isolating light and dark classes.
  const t = (light, dark) => isDark ? dark : light;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1200);
  };

  return (
    <div className={`flex flex-col min-h-screen relative z-10 animate-in fade-in duration-500 ${t('text-slate-800', 'text-slate-200')}`}>
      
      {/* 1. HERO SECTION */}
      <section className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border transition-all duration-300 ${t(
          'bg-indigo-50 text-indigo-700 border-indigo-100', 
          'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
        )}`}>
          <Activity className="w-4 h-4 animate-pulse" /> Live Telemetry Active
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-black tracking-tight max-w-4xl mb-6 transition-colors duration-300 ${t(
          'text-slate-900', 
          'text-white drop-shadow-md'
        )}`}>
          Stop Guessing Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Cognitive Load.</span>
        </h1>
        
        <p className={`text-xl max-w-2xl mb-10 transition-colors duration-300 ${t('text-slate-600', 'text-slate-400')}`}>
          NeuroTrace AI uses XGBoost and Psychomotor Vigilance Tasks to measure your cognitive fatigue, focus, and stress in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/assessment" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1">
            Take the Cognitive Test <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className={`px-8 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${t(
            'border-slate-200 text-slate-700 hover:bg-slate-50', 
            'border-slate-700 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-600'
          )}`}>
            View Live Dashboard
          </Link>
        </div>
      </section>

      {/* 2. TECH STACK / FEATURES */}
      <section className={`py-24 px-6 border-y transition-colors duration-300 ${t(
        'bg-slate-50 border-slate-200', 
        'bg-slate-900/40 border-slate-800/60'
      )}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-black mb-4 transition-colors duration-300 ${t('text-slate-900', 'text-white')}`}>Powered by Advanced AI</h2>
            <p className={t('text-slate-600', 'text-slate-400')}>The intelligence behind the insights.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${t(
              'bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-slate-200/60', 
              'bg-slate-900/80 border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
            )}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${t('bg-indigo-100 text-indigo-600', 'bg-indigo-500/20 text-indigo-400')}`}>
                <Brain className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${t('text-slate-800', 'text-white')}`}>XGBoost Engine</h3>
              <p className={t('text-slate-600', 'text-slate-400')}>Trained on thousands of cognitive data points to predict risk scores with high accuracy.</p>
            </div>

            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${t(
              'bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-slate-200/60', 
              'bg-slate-900/80 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]'
            )}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${t('bg-emerald-100 text-emerald-600', 'bg-emerald-500/20 text-emerald-400')}`}>
                <Code className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${t('text-slate-800', 'text-white')}`}>SHAP Explainability</h3>
              <p className={t('text-slate-600', 'text-slate-400')}>We don't just give you a score. We break down exactly which behaviors are driving your cognitive load.</p>
            </div>

            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${t(
              'bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-slate-200/60', 
              'bg-slate-900/80 border-slate-700/50 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'
            )}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${t('bg-orange-100 text-orange-600', 'bg-orange-500/20 text-orange-400')}`}>
                <Zap className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${t('text-slate-800', 'text-white')}`}>PVT Calibration</h3>
              <p className={t('text-slate-600', 'text-slate-400')}>Integrated Psychomotor Vigilance Tasks to objectively measure your focus and impulsivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM SECTION */}
      <section className="py-24 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-black mb-4 flex items-center justify-center gap-3 transition-colors duration-300 ${t('text-slate-900', 'text-white')}`}>
            <Mail className={`w-8 h-8 ${t('text-indigo-500', 'text-indigo-400')}`} /> Get in Touch
          </h2>
          <p className={t('text-slate-600', 'text-slate-400')}>Have questions about our AI models or API integration? Let us know.</p>
        </div>

        <form onSubmit={handleContactSubmit} className={`p-8 rounded-2xl border transition-colors duration-300 ${t(
          'bg-white border-slate-200 shadow-xl shadow-slate-200/50', 
          'bg-slate-900/60 border-slate-700 shadow-2xl shadow-black/50'
        )}`}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${t('text-slate-700', 'text-slate-300')}`}>Name</label>
              <input 
                type="text" 
                required 
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${t(
                  'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400', 
                  'bg-slate-950/50 border-slate-600 text-white placeholder-slate-500'
                )}`} 
                placeholder="Your Name" 
              />
            </div>
            <div>
              <label className={`block text-sm font-bold mb-2 ${t('text-slate-700', 'text-slate-300')}`}>Email</label>
              <input 
                type="email" 
                required 
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${t(
                  'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400', 
                  'bg-slate-950/50 border-slate-600 text-white placeholder-slate-500'
                )}`} 
                placeholder="you@example.com" 
              />
            </div>
          </div>
          <div className="mb-8">
            <label className={`block text-sm font-bold mb-2 ${t('text-slate-700', 'text-slate-300')}`}>Message</label>
            <textarea 
              required 
              rows="4" 
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${t(
                'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400', 
                'bg-slate-950/50 border-slate-600 text-white placeholder-slate-500'
              )}`} 
              placeholder="How can we help?"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={formStatus !== 'idle'}
            className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${t(
              'bg-indigo-600 hover:bg-indigo-700 text-white', 
              'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            )}`}
          >
            {formStatus === 'idle' && <><Send className="w-5 h-5" /> Send Message</>}
            {formStatus === 'sending' && 'Sending...'}
            {formStatus === 'sent' && 'Message Sent!'}
          </button>
        </form>
      </section>

      {/* 4. FOOTER */}
      <footer className={`py-8 px-6 border-t mt-auto text-center transition-colors duration-300 ${t(
        'border-slate-200 bg-white/50 text-slate-500', 
        'border-slate-800/60 bg-slate-900/40 text-slate-400'
      )}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`flex items-center gap-2 font-bold ${t('text-slate-700', 'text-slate-300')}`}>
            <Brain className={`w-5 h-5 ${t('text-indigo-500', 'text-indigo-400')}`} />
            NeuroTrace AI
          </div>
          
          <p className="text-sm">
            Built for HackIndia by <span className={`font-semibold ${t('text-indigo-600', 'text-indigo-300')}`}>Ananta Kishore Swain</span> & <span className={`font-semibold ${t('text-indigo-600', 'text-indigo-300')}`}>Ashutosh</span>
          </p>
          
          <div className="text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}