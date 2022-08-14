const express = require("express");
const User = require('../Models/Login');
const Address = require('../Models/Address');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');

//insert Address 

router.post('/address', fetchuser, [
    body('apartment', 'Minimum 5 Characters required').isLength({ min: 5 }),
    body('name', 'Minimum 3 Characters required').isLength({ min: 3 }),
    body('last', 'Minimum 3 Characters required').isLength({ min: 3 }),
    body('phone', 'Invalid Mobile Number').isNumeric(),
    body('gmail', 'Invalid Email ID').isEmail(),
], async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;

        let add = await Address.findOne({ email: user.email });
        if (add) {
            return res.status(400).json({ error: "data already exists! " })
        }

        const { name, last, country, house,apartment,town,state,pin,phone,gmail } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const address = new Address({
            email, name, last, country, house, apartment, town, state, pin, phone,gmail
        })
        const saveAddress = await address.save();
        res.json(saveAddress);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})



//Display Address 
router.post('/fetchaddress',fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const email = user.email;
        const add = await Address.findOne({"email":email});
        res.json(add)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Delete User Address : DELETE "/api/cart/deleteaddress" . require Auth
//Display card 
router.delete('/deleteaddress', async (req, res) => {
    try {
        const { id } = req.body;
        const deleteAddress = await Address.findByIdAndDelete(id);
        res.json(deleteAddress);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router 