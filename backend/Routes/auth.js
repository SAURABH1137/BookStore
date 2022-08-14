const express = require("express");
const User = require('../Models/Login');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const mongodb = require('mongodb');
const JWT_SECRET = "book$tore";


// ROUTE 1 : Create a User using : POST "/api/auth/createuser" . Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be atleast 5 Chatracters').isLength({ min: 5 }),
], async (req, res) => {

    //if ther errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user with this email exist already
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a User with this email already exists" })
        }

        //password bcrypt 
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Create new Errors
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }

        //Send authentication token to Server
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json(authtoken);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})



// ROUTE 2 : Authenticate a User using : POST "/api/auth/login"  . Doesn't require Auth

router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password Cannot be blank').exists(),
], async (req, res) => {

    //if ther errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {

        //check user is valid or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with Correct Credentials" });
        }

        //check password is valid or not or compare password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with Correct Credentials" });
        }

        //send payload 
        const data = {
            user: {
                id: user.id
            }
        }

        //Send authentication token to user
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json(authtoken);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3 : Get Logged User Details : POST "/api/auth/getuser" . require Auth

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId);
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// router.post('/getuser', fetchuser, async (req, res) => {
//     try {
//         userId = req.user.id
//         const user = await User.findById(userId)

//          User.aggregate(
//             [
//                 {
//                     "$match": {
//                         '_id': new mongodb.ObjectID(userId)
//                     }
//                 },
//                 {
//                      "$project": { itemDescription: { $concat: [ `${user.email}` ] } } 
//                 }
//             ]
//         ).exec(function (err, result) {
//             if (err) throw err;
//             res.send(passwordCompare);
//         })
//     } catch (error) {
//         res.status(500).send("Internal Server Error");
//     }
// })


router.put('/updateuser', fetchuser, [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
], async (req, res) => {
    try {
        //if ther errors, return bad request and the errors
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        userId = req.user.id;
        const user = await User.findById(userId).select("email");
        const { name, email, gender } = req.body;
        const countuser = await User.find({ email: email }).count();
        if (user) {
            if (countuser <= 1) {
                const update = await User.updateOne(
                    {
                        _id: user.id
                    },
                    {
                        $set: {
                            name: name,
                            email: email,
                            gender: gender
                        }
                    }
                )
                res.json(update)
            } else {
                return res.status(400).json({ error: "Sorry a User with this email already exists" })
            }
        } else {
            res.status(500).send("Internal Server Error");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router 