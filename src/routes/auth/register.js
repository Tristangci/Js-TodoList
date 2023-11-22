const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, name, firstname, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (user.length) {
      return res.status(409).json({ msg: 'Account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await db.execute(
      'INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)',
      [email, name, firstname, hashedPassword]
    );

    const token = jwt.sign({ user: { id: newUser.insertId } }, process.env.SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
