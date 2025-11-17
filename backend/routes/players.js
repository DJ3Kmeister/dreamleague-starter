const express = require('express');
const router = express.Router();

const players = [
  { id: 1, name: 'A. Traoré', position: 'FW', rating: 81, price: 10000 },
  { id: 2, name: 'K. Silva', position: 'FW', rating: 78, price: 9000 },
  { id: 3, name: 'L. Duarte', position: 'MF', rating: 75, price: 8000 },
  { id: 4, name: 'P. Mensah', position: 'GK', rating: 74, price: 7500 },
  { id: 5, name: 'M. Kouamé', position: 'DF', rating: 72, price: 7000 },
  { id: 6, name: "R. N'Golo", position: 'MF', rating: 80, price: 10500 },
  { id: 7, name: 'D. Fofana', position: 'FW', rating: 76, price: 8200 },
  { id: 8, name: 'S. Okoro', position: 'DF', rating: 70, price: 6500 },
  { id: 9, name: 'E. Kouassi', position: 'MF', rating: 73, price: 7200 },
  { id: 10, name: 'B. Koffi', position: 'DF', rating: 68, price: 6000 },
  { id: 11, name: 'Y. Mensah', position: 'GK', rating: 77, price: 7800 },
  { id: 12, name: 'C. Adom', position: 'FW', rating: 79, price: 9800 },
  { id: 13, name: 'P. Doumbia', position: 'MF', rating: 71, price: 6800 },
  { id: 14, name: 'G. Tano', position: 'DF', rating: 66, price: 5500 },
  { id: 15, name: 'L. Samba', position: 'FW', rating: 74, price: 7600 },
  { id: 16, name: 'M. Zongo', position: 'MF', rating: 69, price: 6200 },
  { id: 17, name: 'F. Yao', position: 'DF', rating: 67, price: 5900 },
  { id: 18, name: 'S. Diabaté', position: 'FW', rating: 82, price: 11000 },
  { id: 19, name: 'N. Koné', position: 'MF', rating: 70, price: 6400 },
  { id: 20, name: 'O. Amani', position: 'DF', rating: 73, price: 7100 },
  { id: 21, name: 'H. Ouedraogo', position: 'GK', rating: 65, price: 5200 },
  { id: 22, name: 'R. Sissoko', position: 'FW', rating: 76, price: 8200 },
  { id: 23, name: 'T. Bah', position: 'MF', rating: 68, price: 6000 },
  { id: 24, name: 'A. Kaba', position: 'DF', rating: 69, price: 6300 },
  { id: 25, name: 'M. Diallo', position: 'FW', rating: 77, price: 7800 },
  { id: 26, name: 'L. Traoré', position: 'MF', rating: 72, price: 7000 },
  { id: 27, name: 'V. Koulibaly', position: 'DF', rating: 83, price: 11500 },
  { id: 28, name: 'E. Soro', position: 'FW', rating: 71, price: 6600 },
  { id: 29, name: 'P. Koomson', position: 'MF', rating: 74, price: 7400 },
  { id: 30, name: 'J. Mensah', position: 'DF', rating: 70, price: 6500 }
];

router.get('/', (req, res) => {
  res.json(players);
});

module.exports = router;
