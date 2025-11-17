import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

export default function MatchSimulation({ teamA, teamB, onSetOpponent }) {
  const canvasRef = useRef(null);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState({ a: 0, b: 0 });
  const [minuteDisplay, setMinuteDisplay] = useState(0);
  const [possession, setPossession] = useState(null);

  useEffect(() => {
    drawStaticField();
  }, []);

  function drawStaticField() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 820;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0b6623';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2b7a3a';
    ctx.fillRect(60, 50, 700, 420);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 50);
    ctx.lineTo(400, 470);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 260, 40, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function drawBallAtZone(zone) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(60,50,700,420);
    ctx.restore();

    const center = {
      left: { x: 180, y: 260 },
      center: { x: 400, y: 260 },
      right: { x: 620, y: 260 }
    };
    const pos = center[zone] || center.center;

    ctx.beginPath();
    ctx.fillStyle = '#f3c623';
    ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  }

  async function simulate() {
    if (!teamA) return alert('Crée ta team d\'abord (onglet gauche).');

    const opponent = teamB || {
      name: 'Bots FC',
      players: Array.from({length:11}).map((_,i)=>({name:`Bot${i+1}`, rating:70}))
    };

    if (onSetOpponent) onSetOpponent(opponent);
    setRunning(true);
    setLog([]);
    setScore({ a: 0, b: 0 });
    setMinuteDisplay(0);
    setPossession(null);
    drawStaticField();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/matches/simulate`, {
        teamA,
        teamB: opponent,
        tacticsA: 'balanced',
        tacticsB: 'balanced'
      });

      const timeline = res.data.timeline || [];
      const finalScore = res.data.score || { a: 0, b: 0 };

      for (let i = 0; i < timeline.length; i++) {
        const tick = timeline[i];
        setMinuteDisplay(tick.minute);
        setPossession(tick.possessing);
        drawStaticField();
        const zone = tick.possessing === 'A' ? 'left' : 'right';
        drawBallAtZone(zone);
        setScore({ a: tick.scoreA, b: tick.scoreB });

        if (tick.events && tick.events.length > 0) {
          tick.events.forEach(ev => {
            setLog(prev => [...prev, `${ev.minute}' — ${ev.team === 'A' ? teamA.name : opponent.name} — BUT ! ${ev.player}`]);
          });
        }

        await new Promise(r => setTimeout(r, 200));
      }

      setLog(prev => [...prev, `Fin du match — Score final ${finalScore.a} - ${finalScore.b}`]);
      setScore({ a: finalScore.a, b: finalScore.b });

    } catch (err) {
      console.error('Erreur simulation', err.message);
      alert('Erreur lors de la simulation (backend inaccessible?).');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-lg mb-2">Simulation de match (minute-by-minute)</h3>
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">{teamA ? teamA.name : 'Aucune équipe'}</div>
        <div className="text-2xl"> {score.a} — {score.b} </div>
        <div className="font-semibold">{teamB ? teamB.name : 'Bots FC'}</div>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <div className="px-3 py-1 bg-gray-700 rounded">Minute: {minuteDisplay}'</div>
        <div className="px-3 py-1 bg-gray-700 rounded">Possession: {possession === 'A' ? (teamA ? teamA.name : 'A') : possession === 'B' ? (teamB ? teamB.name : 'B') : '—'}</div>
        <button disabled={running} onClick={simulate} className="px-3 py-1 bg-green-600 rounded">
          {running ? 'Simulation...' : 'Lancer simulation'}
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full h-80 mb-2 rounded canvas-card" />

      <div className="bg-gray-900 p-2 rounded h-48 overflow-auto">
        {log.length === 0 && <div className="text-sm text-gray-400">Aucun événement — lance la simulation</div>}
        {log.map((l, i) => <div key={i} className="text-sm">{l}</div>)}
      </div>
    </div>
  );
}
