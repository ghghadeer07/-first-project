const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { users } = require('../data'); 
// 1) POST /users/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, balance: user.balance }, process.env.JWT_SECRET);
  res.json({ token });
});

// 2) GET /users/me (Auth required)
router.get('/me', auth, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, phone: req.user.phone, balance: req.user.balance });
});

module.exports = router;
