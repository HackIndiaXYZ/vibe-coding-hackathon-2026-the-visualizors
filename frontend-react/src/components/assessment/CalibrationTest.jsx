import React, { useState, useRef } from 'react';
import { Activity, Brain, Play, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CalibrationTest({ onComplete, isDark }) {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, click, finished
  const [round, setRound] = useState(1);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [falseStarts, setFalseStarts] = useState(0);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const startGame = () => {
    setGameState('waiting');
    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    timerRef.current = setTimeout(() => {
      setGameState('click');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      // User clicked too early (Stress/Impulsivity indicator)
      clearTimeout(timerRef.current);
      setFalseStarts(prev => prev + 1);
      setGameState('idle');
      alert("Too early! Wait for the screen to turn green.");
      return;
    }

    if (gameState === 'click') {
      // Valid click
      const reactionTime = Date.now() - startTimeRef.current;
      const newTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newTimes);

      if (round < 3) {
        setRound(prev => prev + 1);
        setGameState('idle');
      } else {
        finishCalibration(newTimes, falseStarts);
      }
    }
  };

  const finishCalibration = (times, earlyClicks) => {
    setGameState('finished');
    
    // Calculate Averages
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    
    // Map Reaction Time to Focus (1-10)
    // < 250ms = 10 (Elite), > 600ms = 1 (Fatigued)
    let calculatedFocus = 10 - ((avgTime - 250) / 40);
    calculatedFocus = Math.max(1, Math.min(10, Math.round(calculatedFocus)));

    // Map False Starts to Stress (1-10)
    // 0 false starts = low stress. 3+ false starts = high stress/anxiety
    let calculatedStress = 3 + (earlyClicks * 2.5);
    calculatedStress = Math.max(1, Math.min(10, Math.round(calculatedStress)));

    // Send data back up to the Assessment form
    setTimeout(() => {
      onComplete({ focus: calculatedFocus, stress: calculatedStress });
    }, 2000);
  };

  return (
    <div className={`p-6 rounded-xl border transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Activity className="w-5 h-5 text-indigo-500" /> Objective Calibration
        </h3>
        <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Round {Math.min(round, 3)} / 3
        </span>
      </div>

      {gameState === 'idle' && (
        <button onClick={startGame} className="w-full h-32 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
          <Play className="w-8 h-8" />
          {round === 1 ? 'Start Reaction Test' : 'Start Next Round'}
        </button>
      )}

      {gameState === 'waiting' && (
        <button onClick={handleClick} className="w-full h-32 bg-red-500 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer">
          <AlertCircle className="w-8 h-8 animate-pulse" />
          Wait for Green...
        </button>
      )}

      {gameState === 'click' && (
        <button onClick={handleClick} className="w-full h-32 bg-emerald-500 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer">
          <CheckCircle2 className="w-8 h-8" />
          CLICK NOW!
        </button>
      )}

      {gameState === 'finished' && (
        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl flex flex-col items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-indigo-500" />
          Calibration Complete. Updating metrics...
        </div>
      )}
    </div>
  );
}