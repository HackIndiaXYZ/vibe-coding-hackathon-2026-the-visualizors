import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, CheckCircle2, TrendingUp, Brain, ArrowRight } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Reusable Components (Keep these exactly as they were)
const MetricCard = ({ title, value, subtitle, valueColor, isDark }) => (
  <div className={`rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center transition-all duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
    <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
    <h2 className={`text-6xl font-black ${valueColor}`}>{value}</h2>
    <p className={`text-sm mt-3 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>
  </div>
);

const ChartContainer = ({ title, icon: Icon, children, isDark, span = 1 }) => (
  <div className={`rounded-xl shadow-sm border p-6 flex flex-col transition-all duration-300 ${span > 1 ? `lg:col-span-${span}` : ''} ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
    <h3 className={`text-md font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      {Icon && <Icon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />}
      {title}
    </h3>
    <div className="flex-grow w-full flex justify-center">
      {children}
    </div>
  </div>
);

export default function AnalyticsDashboard({ isDark }) {
  const location = useLocation();
  const data = location.state?.analyticsData;

  // If no data is found (user navigated directly to dashboard), show this prompt
  if (!data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
        <Brain className={`w-20 h-20 mb-6 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Telemetry Found</h2>
        <p className={`mb-8 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          The AI engine requires your current cognitive metrics to generate a dashboard. Please run the assessment to calibrate your profile.
        </p>
        <Link to="/assessment" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors">
          Start Calibration <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Formatting variables
  const textColor = isDark ? '#cbd5e1' : '#334155'; 
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'; 

  const commonChartOptions = {
    responsive: true, maintainAspectRatio: false, color: textColor,
    scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } },
    plugins: { legend: { labels: { color: textColor } } }
  };

  // Populate Charts with LIVE / DYNAMIC DATA
  const shapChartData = {
    labels: ['Stress', 'Screen Time', 'Sleep', 'Focus'],
    datasets: [{
      label: 'Impact Factor',
      data: [data.shap_contributions.stress_impact, data.shap_contributions.screen_time_impact, data.shap_contributions.sleep_impact, data.shap_contributions.focus_impact],
      backgroundColor: ['rgba(239, 68, 68, 0.9)', 'rgba(249, 115, 22, 0.9)', 'rgba(59, 130, 246, 0.9)', 'rgba(34, 197, 94, 0.9)'],
      borderRadius: 4,
    }]
  };

  const trendChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [{
      label: 'Risk Score',
      data: data.historical_trend,
      borderColor: 'rgba(99, 102, 241, 1)', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: ['Deep Focus', 'Distracted', 'Rest'],
    datasets: [{
      data: data.productivity_split,
      backgroundColor: ['rgba(34, 197, 94, 0.9)', 'rgba(239, 68, 68, 0.9)', 'rgba(59, 130, 246, 0.9)'],
      borderColor: isDark ? '#0f172a' : '#ffffff', borderWidth: 2,
    }]
  };

  const getRiskColor = (score) => {
    if (score < 40) return 'text-emerald-500';
    if (score < 70) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans animate-in fade-in duration-500 relative z-10">
      
      <header className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Your AI Analytics Profile
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Generated based on your latest assessment.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MetricCard 
          title="Current Risk Level" 
          value={data.risk_score.toFixed(1)} 
          subtitle="Scale: 0-100" 
          valueColor={getRiskColor(data.risk_score)} 
          isDark={isDark} 
        />

        <div className={`rounded-xl shadow-sm border p-6 lg:col-span-2 transition-all duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
           <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <AlertTriangle className="w-5 h-5 text-indigo-500" />
              Gemini Behavioral Insights
           </h3>
           <ul className="space-y-3">
             {data.insights.map((rec, index) => (
               <li key={index} className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                 <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                 <span className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{rec}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer title="Feature Explainability (SHAP)" span={2} isDark={isDark}>
          <div className="h-64 w-full"><Bar data={shapChartData} options={{ ...commonChartOptions, indexAxis: 'y', plugins: { legend: { display: false } } }} /></div>
        </ChartContainer>

        <ChartContainer title="Cognitive Distribution" isDark={isDark}>
          <div className="h-48 w-full mt-4"><Doughnut data={doughnutData} options={{ ...commonChartOptions, scales: { x: { display: false }, y: { display: false } }, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }} /></div>
        </ChartContainer>

        <ChartContainer title="7-Day Risk Trend" icon={TrendingUp} span={3} isDark={isDark}>
          <div className="h-64 w-full"><Line data={trendChartData} options={commonChartOptions} /></div>
        </ChartContainer>
      </div>
    </div>
  );
}