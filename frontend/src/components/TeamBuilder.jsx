import React, { useState } from 'react';
import axios from 'axios';

export default function TeamBuilder({ players = [], onSave }) {
  const [teamName, setTeamName] = useState('Dream Team');
  const [selected, setSelected] = useState([]);

  function togglePlayer(p) {
    const exists = selected.find(s => s.name === p.name);
    if (exists) {
      setSelected(selected.filter(s => s.name !== p.name));
    } else {
      if (selected.length >= 11) return alert('Max 11 joueurs');
      setSelected([...selected, p]);
    }
  }

  async function saveTeam() {
    if (selected.length < 7) return alert('Sélectionne au moins 7 joueurs pour tester');
    const team = { name: teamName, players: selected };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/teams`, team);
    } catch (err) {
      console.warn('Erreur en sauvegardant l\'équipe (backend?)', err.message);
    }
    if (onSave) onSave(team);
    alert('Équipe sauvegardée (localement).');
  }

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-xl mb-2">Créer ton équipe</h2>
      <input
        className="w-full p-2 mb-3 rounded bg-gray-700"
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
      />
      <div className="mb-3">
        <strong>Joueurs disponibles :</strong>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-56 overflow-auto">
          {players.map(p => {
            const chosen = selected.find(s => s.name === p.name);
            return (
              <button
                key={p.id || p.name}
                onClick={() => togglePlayer(p)}
                className={`p-2 text-left rounded ${chosen ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-gray-200">{p.position} — {p.rating}</div>
              </button>
            );
          })}
          {players.length === 0 && <div className="text-sm text-gray-400">Chargement des joueurs...</div>}
        </div>
      </div>
      <div className="mb-2">
        <strong>Sélection ({selected.length}/11):</strong>
        <ul className="list-disc ml-5">
          {selected.map((s, i) => <li key={i}>{s.name} — {s.position} — {s.rating}</li>)}
        </ul>
      </div>
      <div className="flex gap-2">
        <button onClick={saveTeam} className="px-3 py-1 bg-blue-600 rounded">Sauvegarder équipe</button>
      </div>
    </div>
  );
}
