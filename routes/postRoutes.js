const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const { user } = require('../schema/userSchema');
const { post } = require('../schema/postSchema');

router.post('/', [
        check('heading', 'heading is required')
        .not()
        .isEmpty(),
        check('description', 'description is required')
        .not()
        .isEmpty()
    ],
    async(req, res) => {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const token = req.header('x-auth-token');

        // Check if not token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        try {
            jwt.verify(token, "jimmysecret", (error, decoded) => {
                if (error) {
                    res.status(401).json({ msg: 'Token is not valid' });
                } else {
                    req.user = decoded.user;
                }
            });
        } catch (err) {
            console.error('something wrong with auth middleware');
            res.status(500).json({ msg: 'Server Error' });
        }
        try {
            const users = await user.findById(req.user.id);
            console.log(users.id);

            const newPost = new post({
                userId: users.id,
                heading: req.body.heading,
                description: req.body.description
            });

            await newPost.save();

            res.json(newPost);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

router.get('/:id', async(req, res) => {
    try {
        const posts = await post.find({ userId: req.params.id });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async(req, res) => {
    try {
        const posts = await post.find();
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async(req, res) => {
    const token = req.header('x-auth-token');
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    } else {
        jwt.verify(token, "jimmysecret", (error, decoded) => {
            if (error) {
                res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req.user = decoded.user;
            }
        });
        let postData = await post.findById(req.params.id);
        console.log(postData);
        console.log(req.user.id);
        await postData.remove();
        res.status(200).json({ msg: "deleted" });
    }

});

module.exports = router;