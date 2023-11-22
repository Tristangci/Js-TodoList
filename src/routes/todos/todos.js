const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [todo] = await db.execute('SELECT * FROM todo');
    if (todo.length === 0)
      return res.status(404).json({ msg: 'Not found' });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, user_id, due_time, status } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM user WHERE id = ?', [user_id]);
    if (user.length === 0)
      return res.status(404).json({ msg: 'Not found' });
    await db.execute(
      'INSERT INTO todo (title, description, user_id, due_time, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, user_id, due_time, status]
    );
    const [todo] = await db.execute('SELECT * FROM todo WHERE user_id = ? ORDER BY id DESC LIMIT 1', [user_id]);
    res.json(todo[0]);    
    } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, user_id, due_time, status } = req.body;

  try {
    await db.execute(
      'UPDATE todo SET title = ?, description = ?, user_id = ?, due_time = ?, status = ? WHERE id = ?',
      [title, description, user_id, due_time, status, req.params.id]
    );
    const [record] = await db.execute('SELECT * FROM todo WHERE id = ?', [req.params.id]);
    if (record.length === 0)
      return res.status(404).json({ msg: 'Not found' });
    res.json(record);      
    } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [record] = await db.execute('DELETE FROM todo WHERE id = ?', [req.params.id]);
    if (record.affectedRows === 0)
      return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
