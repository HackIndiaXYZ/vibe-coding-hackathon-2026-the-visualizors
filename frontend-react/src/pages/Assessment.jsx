import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Moon, Activity, Monitor, ArrowRight, Loader2, Target } from 'lucide-react';
import CalibrationTest from '../components/assessment/CalibrationTest';

export default function Assessment({ isDark }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGame, setShowGame] = useState(false);
  
  const [formData, setFormData] = useState({
    sleep: 7,
    stress: 5,
    focus: 5,
    screen_time: 6
  });

  const handleCalibrationComplete = (calculatedMetrics) => {
    setFormData(prev => ({
      ...prev,
      focus: calculatedMetrics.focus,
      stress: calculatedMetrics.stress
    }));
    setShowGame(false);
  };

  const handleSliderChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // THE FLASK API CALL (Ashutosh's endpoint)
      const response = await fetch('http://127.0.0.1:5000/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("API not ready");
      
      const apiResult = await response.json();
      setIsSubmitting(false);
      
      // Pass the real AI data to the dashboard
      navigate('/dashboard', { state: { analyticsData: apiResult } });

    } catch (error) {
      console.log("Flask API not detected. Falling back to dynamic Demo generation.");
      
      // HACKATHON FALLBACK: Dynamically generate demo data based on slider inputs
      setTimeout(() => {
        setIsSubmitting(false);
        const demoRisk = (formData.stress * 4) + (formData.screen_time * 2) + ((10 - formData.focus) * 3) + ((10 - formData.sleep) * 2);
        
        const demoResult = {
          risk_score: Math.min(100, demoRisk),
          shap_contributions: {
            sleep_impact: (10 - formData.sleep) * 1.5,
            stress_impact: formData.stress * 2.2,
            focus_impact: (10 - formData.focus) * 1.8,
            screen_time_impact: formData.screen_time * 1.2
          },
          insights: [
            `With ${formData.sleep} hours of sleep, your recovery capacity is ${formData.sleep < 6 ? 'compromised' : 'optimal'}.`,
            `Your stress level of ${formData.stress}/10 is driving significant cognitive fatigue.`,
            `Consider a 15-minute digital detox to offset your ${formData.screen_time} hours of screen time.`
          ],
          historical_trend: [45, 50, 48, 55, 60, demoRisk - 5, Math.min(100, demoRisk)],
          productivity_split: [formData.focus * 5, formData.screen_time * 5, formData.sleep * 5]
        };

        // Pass the dynamically generated demo data to the dashboard
        navigate('/dashboard', { state: { analyticsData: demoResult } });
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-black tracking-tight mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Cognitive Check-In
        </h1>
        <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Calibrating your AI baseline for today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`rounded-2xl shadow-xl border p-8 transition-all duration-300 ${isDark ? 'bg-slate-900/90 border-slate-700/50 shadow-indigo-500/5' : 'bg-white border-slate-200'}`}>
        
        {/* Toggle Auto-Calibration */}
        <div className="mb-8">
          <button 
            type="button"
            onClick={() => setShowGame(!showGame)}
            className={`w-full py-3 px-4 rounded-xl border-2 border-dashed font-bold flex items-center justify-center gap-2 transition-colors ${isDark ? 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/20' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}
          >
            <Target className="w-5 h-5" />
            {showGame ? "Cancel Calibration & Use Manual Sliders" : "Don't know your levels? Auto-Calibrate Now"}
          </button>
        </div>

        {/* Conditionally render the Game OR the Sliders */}
        {showGame ? (
          <div className="mb-8 animate-in zoom-in-95 duration-300">
            <CalibrationTest onComplete={handleCalibrationComplete} isDark={isDark} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Sleep Metric */}
            <div>
              <label className={`flex items-center justify-between font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-500" /> Sleep Duration</span>
                <span className="text-xl text-indigo-500">{formData.sleep} hours</span>
              </label>
              <input 
                type="range" name="sleep" min="0" max="14" step="0.5"
                value={formData.sleep} onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Stress Metric */}
            <div>
              <label className={`flex items-center justify-between font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="flex items-center gap-2"><Activity className="w-5 h-5 text-red-500" /> Perceived Stress Level</span>
                <span className="text-xl text-red-500">{formData.stress} / 10</span>
              </label>
              <input 
                type="range" name="stress" min="1" max="10" step="1"
                value={formData.stress} onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Screen Time Metric */}
            <div>
              <label className={`flex items-center justify-between font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="flex items-center gap-2"><Monitor className="w-5 h-5 text-orange-500" /> Screen Time (Last 24h)</span>
                <span className="text-xl text-orange-500">{formData.screen_time} hours</span>
              </label>
              <input 
                type="range" name="screen_time" min="0" max="18" step="0.5"
                value={formData.screen_time} onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Focus Metric */}
            <div>
              <label className={`flex items-center justify-between font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="flex items-center gap-2"><Brain className="w-5 h-5 text-emerald-500" /> Ability to Focus</span>
                <span className="text-xl text-emerald-500">{formData.focus} / 10</span>
              </label>
              <input 
                type="range" name="focus" min="1" max="10" step="1"
                value={formData.focus} onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting || showGame} // Disable submit if they are playing the game
          className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing Telemetry...</>
          ) : (
            <>Generate Cognitive Report <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  );
}