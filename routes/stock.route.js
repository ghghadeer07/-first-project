const express = require('express');
const router = express.Router();
const { stocks, plans, users } = require('../data');

// 5) POST /purchase (Auth required)
router.post('/purchase', auth, (req, res) => {
  const { planId } = req.body;
  const plan = plans.find(p => p.id == planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  const user = users.find(u => u.id == req.user.id);
  if (user.balance < plan.price) return res.status(400).json({ error: 'Insufficient balance' });
  
  const stock = stocks.find(s => s.planId == planId && s.status === 'ready');
  if (!stock) return res.status(404).json({ error: 'No available stock' });
  
  stock.status = 'sold';
  user.balance -= plan.price;
  res.json({ plan, code: stock.code });
});

// 6) GET /stock/:planId/available
router.get('/:planId/available', (req, res) => {
  const available = stocks.filter(s => s.planId == req.params.planId && s.status === 'ready');
  const masked = available.map(s => ({ ...s, code: `****${s.code.slice(-4)}` })); // إخفاء معظم الكود
  res.json(masked);
});

// 8) GET /stock/summary
router.get('/summary', (req, res) => {
  const summary = {};
  stocks.forEach(s => {
    if (!summary[s.planId]) summary[s.planId] = { planId: s.planId, ready: 0, sold: 0, error: 0 };
    summary[s.planId][s.status]++;
  });
  res.json(Object.values(summary));
});

module.exports = router;
