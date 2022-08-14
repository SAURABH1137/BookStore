const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Cart = require("../Models/Cart");
const Book = require("../Models/Books");
const mongodb = require('mongodb');
const User = require("../Models/Login");
const fetchuser = require('../Middleware/fetchuser');

// ROUTE 1: Add A Cart : POST "/api/cart/addcart" . require Auth

router.post('/addcart', async (req, res) => {
    try {
        const { uid, pname, status } = req.body;
        //if ther errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const cart = new Cart({
            uid, pname, status
        })
        const saveCart = await cart.save();
        res.json(saveCart);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: Display User Cart : GET "/api/cart/displaycart" . require Auth

router.post('/displaycart', async (req, res) => {
    try {
        const { userId,type } = req.body;
        Cart.aggregate([
            {
                "$match": {
                    "uid": userId,
                    "status":type
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
                    "_id": 1, "date": 1, "CartDetails.authors": 1, "CartDetails.name": 1, "CartDetails.pages": 1, "CartDetails.price": 1, "CartDetails.type": 1, "CartDetails.image": 1, "CartDetails.status": 1, "CartDetails.variants": 1
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

// ROUTE 3: Delete User Cart : DELETE "/api/cart/deletecart" . require Auth
//Display card 
router.delete('/deletecart', async (req, res) => {
    try {
        const { Cid } = req.body;
        const deleteCart = await Cart.findByIdAndDelete(Cid);
        res.json(deleteCart);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Update User Cart : UPDATE "/api/cart/updatecart" . require Auth
router.put('/updatecart', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const update = await Cart.updateMany(
            {
                "uid": user.email,
                "status":"Cart"

            },
            {
                $set: { status: "wait", date:Date.now()}
            }
        );
        res.json(update);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: Display Print Cart : GET "/api/cart/printcart" . require Auth

router.post('/printcart', async (req, res) => {
    try {
        const { pid } = req.body;
        Cart.aggregate([
            {
                "$match": {
                    '_id': new mongodb.ObjectID(pid),
                    "status":'Buy'
                }
            },
            {
                "$sort": {
                    "date": -1,
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
                    "_id": 1, "date": 1, "CartDetails.authors": 1, "CartDetails.name": 1, "CartDetails.pages": 1, "CartDetails.price": 1, "CartDetails.type": 1, "CartDetails.image": 1, "CartDetails.status": 1
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

module.exports = router  