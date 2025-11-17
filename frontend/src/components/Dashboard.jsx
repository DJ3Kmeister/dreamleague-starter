import React from 'react';

export default function Dashboard({ team, opponent }) {
  return (
    <div className="p-4 bg-gray-800 rounded mt-4">
      <h3 className="text-lg mb-2">Dashboard</h3>
      <div className="mb-2">
        <strong>Mon équipe :</strong>
        {team ? (
          <div>
            <div className="font-semibold">{team.name}</div>
            <div className="text-sm text-gray-300">Players: {team.players.length}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">Aucune équipe sélectionnée</div>
        )}
      </div>
      <div>
        <strong>Adversaire :</strong>
        {opponent ? (
          <div>
            <div className="font-semibold">{opponent.name}</div>
            <div className="text-sm text-gray-300">Players: {opponent.players.length}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">Aucun adversaire</div>
        )}
      </div>
    </div>
  );
}
