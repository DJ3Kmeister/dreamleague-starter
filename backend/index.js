const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const playersRoute = require('./routes/players');
const teamsRoute = require('./routes/teams');
const matchesRoute = require('./routes/matches');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/players', playersRoute);
app.use('/api/teams', teamsRoute);
app.use('/api/matches', matchesRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DreamLeague backend started on port ${PORT}`);
});
