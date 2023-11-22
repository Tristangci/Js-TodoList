const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const router = express.Router();

router.get('/todos', async (req, res) => {
  try {
    const [todos] = await db.execute('SELECT * FROM todo WHERE user_id = ?', [req.userId]);
    if (todos.length === 0)
      return res.status(404).json({ msg: 'Not found' });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [user] = await db.execute('SELECT * FROM user WHERE id = ? or email = ?', [req.params.id, req.params.id]);
    if (!user.length)
      return res.status(404).json({ msg: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [user] = await db.execute('SELECT * FROM user');
    if (user.length === 0)
      return res.status(404).json({ msg: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { email, name, firstname, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await db.execute(
      'UPDATE user SET email = ?, name = ?, firstname = ?, password = ? WHERE id = ?',
      [email, name, firstname, hashedPassword, req.params.id]
    );
    const [user] = await db.execute('SELECT * FROM user WHERE id = ?', [req.params.id]);
    if (!user.length)
      return res.status(404).json({ msg: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [user] = await db.execute('SELECT * FROM user WHERE id = ?', [req.params.id]);
    if (!user.length)
      return res.status(404).json({ msg: 'Not found' });
    await db.execute('DELETE FROM todo WHERE user_id = ?', [req.params.id]);
    await db.execute('DELETE FROM user WHERE id = ?', [req.params.id]);
    res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
