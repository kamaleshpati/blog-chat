const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const { user } = require('../schema/userSchema');

router.get('/', async(req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/:email/:password', async(req, res) => {
    try {
        const users = await user.findOne({ email: req.params.email });
        if (users === null) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User doesnot exist' }] });
        }
        const payload = {
            user: {
                id: users._id
            }
        };
        console.log(payload);
        if (req.params.password === users.password) {
            jwt.sign(
                payload,
                "jimmysecret", { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ name: users.name, id: users.id, token });
                }
            );
        } else {
            res.status(400).json({ msg: "auth failed" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req.body);
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name, email, password } = req.body;

    try {
        let newuser = await user.findOne({ email });

        if (newuser) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already exists' }] });
        }

        newuser = new user({
            name,
            email,
            password
        });

        await newuser.save();

        const payload = {
            user: {
                id: newuser.id //can use _id as mongo,mongoose gives abstarction
            }
        };
        //jwtSecret = jimmysecret in sha2
        jwt.sign(
            payload,
            "jimmysecret", { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ name: req.body.name, id: newuser.id, token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;