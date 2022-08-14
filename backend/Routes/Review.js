const express = require("express");
const User = require('../Models/Login');
const Review = require('../Models/Review');
const Contact = require('../Models/Contact');
const Help = require('../Models/Help');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');


router.post('/review', fetchuser, [
    body('message', 'Minimum 15 Characters required').isLength({ min: 15 }),
], async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;
        const { pname, message, rating } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const review = new Review({
            email, pname, message, rating
        })

        const saveReview = await review.save();
        res.json(saveReview);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})




router.get('/getreview', async (req, res) => {
    try {
        const {pname } = req.body;
        const review = await Review.aggregate(
            [
                {
                    $sort: {
                        "date": -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "email",
                        foreignField: "email",
                        as: "CartDetails"
                    }
                },
                {
                    "$project": {
                        "pname": 1, "message": 1, "date": 1, "rating": 1, "CartDetails.name": 1,
                    }
                },
                { $unwind: "$CartDetails" }

            ]).exec(function (err, result) {
                if (err) throw err;
                res.send(result);
            })

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


router.post('/getreviewcart', async (req, res) => {
    try {
        const { pname } = req.body;
        const review = await Review.aggregate(
            [
                {
                    $match: {
                        "pname": pname,
                    }
                },

                {
                    $sort: {
                        "date": -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "email",
                        foreignField: "email",
                        as: "CartDetails"
                    }
                },
                {
                    "$project": {
                        "pname": 1, "message": 1, "date": 1, "rating": 1, "CartDetails.name": 1,
                    }
                },
                { $unwind: "$CartDetails" }

            ]
        ).exec(function (err, result) {
            if (err) throw err;
            res.send(result);
        })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


router.post('/contact', [
    body('fullname', 'Minimum 5 Characters required').isLength({ min: 5 }),
    body('email', 'Invalid Email ID').isEmail(),
    body('message', 'Minimum 15 Characters required').isLength({ min: 15 })
], async (req, res) => {
    try {
        const { fullname, email, status, message } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const contact = new Contact({ fullname, email, status, message })
        // res.json(contact);
        const saveContact = await contact.save();
        res.json(saveContact);
    } catch (error) {
        res.status(500).send("Internal Server Error..");
    }
})

router.post('/help', fetchuser, [
    body('message', 'Minimum 15 Characters required').isLength({ min: 15 }),
], async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;
        const { message } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const help = new Help({
            email, message
        })

        const savehelp = await help.save();
        res.json(savehelp);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.get('/gethelp', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;
        const help = await Help.find({ email: email });
        res.json(help)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router 