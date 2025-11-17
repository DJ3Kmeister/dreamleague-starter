import React, { useState, useEffect } from 'react';
import TeamBuilder from './components/TeamBuilder';
import MatchSimulation from './components/MatchSimulation';
import Dashboard from './components/Dashboard';
import axios from 'axios';

export default function App() {
  const [team, setTeam] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/players`);
        setPlayers(res.data);
      } catch (err) {
        console.error('Impossible de charger les joueurs (backend non démarré?)', err.message);
      }
    }
    loadPlayers();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">DreamLeague — Starter</h1>
        <p className="text-sm text-gray-300">Prototype : crée ton équipe et lance une simulation animée</p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TeamBuilder players={players} onSave={setTeam} />
          <Dashboard team={team} opponent={opponent} />
        </div>
        <div className="lg:col-span-2">
          <MatchSimulation teamA={team} teamB={opponent} onSetOpponent={setOpponent} />
        </div>
      </main>
    </div>
  );
}
