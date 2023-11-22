const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        res.json({ msg: 'Hello World'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const [user] = await db.execute('SELECT * FROM user WHERE id = ? or email = ?', [id, id]);
    if (!user.length) {
      return res.status(404).json({ msg: 'Not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
