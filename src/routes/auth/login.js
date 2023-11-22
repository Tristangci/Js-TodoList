const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [user] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length === 0)
            return res.status(400).json({ msg: 'Invalid Credentials' });
        
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid Credentials' });
        
        const payload = { user: { id: user[0].id } };
        jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
