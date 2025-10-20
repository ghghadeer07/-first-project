const express = require('express');
const router = express.Router();
const { plans } = require('../data');

// 3) GET /plans
router.get('/', (req, res) => {
  res.json(plans);
});

// 4) GET /plans/:id
router.get('/:id', (req, res) => {
  const plan = plans.find(p => p.id == req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json(plan);
});

// 7) GET /plans/search?q=term
router.get('/search', (req, res) => {
  const q = req.query.q?.toLowerCase();
  if (!q) return res.json(plans);
  const results = plans.filter(p => p.title.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q));
  res.json(results);
});

module.exports = router;
