const express = require('express');
const router = express.Router();

function averageRating(team) {
  if (!team || !team.players || team.players.length === 0) return 60;
  const sum = team.players.reduce((s, p) => s + (p.rating || 60), 0);
  return sum / team.players.length;
}

function tacticModifier(tactic) {
  switch ((tactic || 'balanced').toLowerCase()) {
    case 'offensive': return 6;
    case 'defensive': return -4;
    case 'pressing': return 3;
    case 'counter': return 2;
    default: return 0;
  }
}

function pickRandomPlayer(team, filterPos = null) {
  if (!team || !team.players || team.players.length === 0) return { name: 'Unknown', rating: 60 };
  const arr = filterPos ? team.players.filter(p => p.position && p.position.toUpperCase().startsWith(filterPos.toUpperCase())) : team.players;
  if (arr.length === 0) return team.players[Math.floor(Math.random() * team.players.length)];
  return arr[Math.floor(Math.random() * arr.length)];
}

router.post('/simulate', (req, res) => {
  const { teamA, teamB, tacticsA = 'balanced', tacticsB = 'balanced' } = req.body;

  const defaultTeam = {
    name: 'Bots FC',
    players: Array.from({ length: 11 }).map((_, i) => ({ name: `Bot ${i+1}`, rating: 70 }))
  };

  const A = teamA || defaultTeam;
  const B = teamB || defaultTeam;

  let avgA = averageRating(A);
  let avgB = averageRating(B);

  let strengthA = avgA + tacticModifier(tacticsA);
  let strengthB = avgB + tacticModifier(tacticsB);

  let possessionProbA = strengthA / (strengthA + strengthB);

  const events = [];
  const timeline = [];
  const state = {
    scoreA: 0,
    scoreB: 0,
    fatigueA: 0,
    fatigueB: 0
  };

  for (let minute = 1; minute <= 90; minute++) {
    state.fatigueA += 0.02;
    state.fatigueB += 0.02;

    const effectiveA = Math.max(30, strengthA - state.fatigueA * 10 + (Math.random() - 0.5) * 3);
    const effectiveB = Math.max(30, strengthB - state.fatigueB * 10 + (Math.random() - 0.5) * 3);

    possessionProbA = effectiveA / (effectiveA + effectiveB);
    const possessing = Math.random() < possessionProbA ? 'A' : 'B';

    const baseShotChanceA = Math.max(0.01, (effectiveA / 100) * (tacticsA === 'offensive' ? 0.12 : tacticsA === 'defensive' ? 0.04 : 0.08));
    const baseShotChanceB = Math.max(0.01, (effectiveB / 100) * (tacticsB === 'offensive' ? 0.12 : tacticsB === 'defensive' ? 0.04 : 0.08));

    const eventsThisMinute = [];

    if (possessing === 'A' && Math.random() < baseShotChanceA) {
      const shooter = pickRandomPlayer(A, 'F') || pickRandomPlayer(A, 'M') || pickRandomPlayer(A);
      const gkB = (B.players.find(p => p.position && p.position.toUpperCase().startsWith('G')) || { rating: 65 });
      const baseScoreProb = Math.max(0.02, (shooter.rating - gkB.rating + 10) / 100);
      const situationalModifier = (effectiveA - effectiveB) / 200;
      const finalProb = Math.min(0.9, Math.max(0.01, baseScoreProb + situationalModifier + (Math.random() - 0.5) * 0.05));

      if (Math.random() < finalProb) {
        state.scoreA += 1;
        eventsThisMinute.push({ minute, team: 'A', type: 'goal', player: shooter.name });
      }
    } else if (possessing === 'B' && Math.random() < baseShotChanceB) {
      const shooter = pickRandomPlayer(B, 'F') || pickRandomPlayer(B, 'M') || pickRandomPlayer(B);
      const gkA = (A.players.find(p => p.position && p.position.toUpperCase().startsWith('G')) || { rating: 65 });
      const baseScoreProb = Math.max(0.02, (shooter.rating - gkA.rating + 10) / 100);
      const situationalModifier = (effectiveB - effectiveA) / 200;
      const finalProb = Math.min(0.9, Math.max(0.01, baseScoreProb + situationalModifier + (Math.random() - 0.5) * 0.05));

      if (Math.random() < finalProb) {
        state.scoreB += 1;
        eventsThisMinute.push({ minute, team: 'B', type: 'goal', player: shooter.name });
      }
    }

    timeline.push({
      minute,
      possessing,
      effectiveA: Math.round(effectiveA * 100) / 100,
      effectiveB: Math.round(effectiveB * 100) / 100,
      scoreA: state.scoreA,
      scoreB: state.scoreB,
      events: eventsThisMinute
    });

    eventsThisMinute.forEach(ev => events.push(ev));
  }

  res.json({
    score: { a: state.scoreA, b: state.scoreB },
    events,
    timeline
  });
});

module.exports = router;
