const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { user } = require('../schema/userSchema');
router.get('/', async(req, res) => {
    try {
        const token = req.header('x-auth-token');

        // Check if not token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        jwt.verify(token, "jimmysecret", (error, decoded) => {
            if (error) {
                res.status(401).json({ msg: 'Token is not valid' });
            } else {
                res.status(200).json({ msg: "valid token" });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/:password', async(req, res) => {
    try {
        const token = req.header('x-auth-token');

        // Check if not token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        let id;
        jwt.verify(token, "jimmysecret", (error, decoded) => {
            if (error) {
                id = null;
            } else {
                id = decoded.user.id;
            }
        });
        let userData = await user.findById(id);
        console.log(userData.password === req.params.password);
        if (id === null)
            res.status(401).json({ msg: "Token is not valid" });
        else if (userData.password === req.params.password)
            res.status(200).json({ msg: true });
        else
            res.status(200).json({ msg: false });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;