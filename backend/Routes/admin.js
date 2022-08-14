const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Books = require("../Models/Books");
const User = require('../Models/Login');
const Cart = require("../Models/Cart");
const contacts = require("../Models/Contact");
const Help = require("../Models/Help");
const mongodb = require('mongodb');

// ROUTE 1: POST User Details : POST "/api/admin/userlist" . require Auth

router.post('/userlist', async (req, res) => {
    try {
        const user = await User.find({ status: 'Active' });
        res.json(user)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/waitlist', async (req, res) => {
    try {
        const { type } = req.body;
        Cart.aggregate([
            {
                "$match": {
                    "status": type
                }
            },
            {
                "$sort": {
                    "date": -1
                }
            },

            {
                $lookup: {
                    from: "books",
                    localField: "pname",
                    foreignField: "name",
                    as: "CartDetails"
                }
            },
            {
                "$project": {
                    "_id": 1, "date": 1, "CartDetails.authors": 1, "CartDetails.name": 1, "CartDetails.pages": 1, "CartDetails.price": 1, "CartDetails.type": 1, "CartDetails.image": 1, "CartDetails.status": 1, "CartDetails.quantity": 1
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

// ROUTE 4: Update Cart : PUT "/api/admin/update" . require Auth
router.put('/update', async (req, res) => {
    try {
        const { id } = req.body;
        const cartupdate = await Cart.updateOne({ _id: id }, { status: "Buy" });
        res.json(cartupdate);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 5: Update Book Quantity : PUT "/api/admin/update" . require Auth
router.put('/updatebook', async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const bookupdate = await Books.updateOne({ name: name }, { quantity: quantity });
        res.json(bookupdate);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})



// Count User Details : Count "/api/admin/count" 

router.post('/usercount', async (req, res) => {
    try {
        const countuser = await User.find({ status: 'Active' }).count();
        res.json(countuser)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/cartcount', async (req, res) => {
    try {
        const { type } = req.body;
        const user = await Cart.find({ status: type }).count();
        res.json(user)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/earncount', async (req, res) => {
    try {
        Cart.aggregate([
            {
                "$match": {
                    "status": 'Buy'
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "pname",
                    foreignField: "name",
                    as: "CartDetails"
                }
            },
            {
                "$project": {
                    "_id": 1, "CartDetails.price": 1,
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


router.post('/feedquery', async (req, res) => {
    try {
        const { type } = req.body;
        const query = await contacts.find({ status: type });
        res.json(query);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/countquery', async (req, res) => {
    try {
        const user = await contacts.find({ status: 'query' }).count();
        res.json(user)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/displayquery', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await contacts.find({ _id: new mongodb.ObjectID(id) });
        res.json(user)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.put('/updateanswer', async (req, res) => {
    try {
        const { id, Answer } = req.body;
        const updateanswer = await contacts.updateOne({  _id: new mongodb.ObjectID(id) }, { Answer: Answer });
        res.json(updateanswer);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/help', async (req, res) => {
    try {
        const query = await Help.find({ status: 'Active' });
        res.json(query);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/displayhelp', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await Help.find({ _id: new mongodb.ObjectID(id) });
        res.json(user)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.put('/updatehelp', async (req, res) => {
    try {
        const { id, Answer } = req.body;
        const updateanswer = await Help.updateOne({  _id: new mongodb.ObjectID(id) }, { Answer: Answer });
        res.json(updateanswer);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router 