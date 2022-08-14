const express = require("express");
const User = require('../Models/Login');
const Card = require('../Models/Card');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');

//insert Card

router.post('/card', fetchuser, [
    body('cardno', 'Invalid Card Number').isLength({ min: 12 }),
    body('month', 'Invalid Month').isLength({ min: 2 }),
    body('year', 'Invalid Year').isLength({ min: 4 }),
    body('cvv', 'Invalid CVV').isLength({ min: 3 }),
    body('cardhname', 'Invalid Card Holder Name').isLength({ min: 5 }),
], async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;

        let add = await Card.findOne({ email: user.email });
        if (add) {
            return res.status(400).json({ error: "data already exists! " })
        }

        const { cardno, month, year, cvv, cardhname, checkbox} = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const card = new Card({
            email, cardno, month, year, cvv, cardhname, checkbox
        })
        const savecard = await card.save();
        res.json(savecard);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


//Display card 
router.post('/fetchcard',fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;
        const card = await Card.findOne({"email":email});
        res.json(card)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 3: Delete User Card : DELETE "/api/cart/deletecard" . require Auth
router.delete('/deletecard', async (req, res) => {
    try {
        const { id } = req.body;
        const deleteCard = await Card.findByIdAndDelete(id);
        res.json(deleteCard);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router 