const express = require('express');
const router = express.Router();

let teams = [];

router.get('/', (req, res) => {
  res.json(teams);
});

router.post('/', (req, res) => {
  const team = req.body;
  if (!team || !team.name || !Array.isArray(team.players)) {
    return res.status(400).json({ error: 'Team must have name and players[]' });
  }
  const id = Date.now();
  const newTeam = { id, ...team };
  teams.push(newTeam);
  res.status(201).json(newTeam);
});

module.exports = router;
