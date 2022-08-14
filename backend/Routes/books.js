const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Books = require("../Models/Books");
const fetchuser = require('../Middleware/fetchuser');

// ROUTE 1: Get All the Books : GET "/api/books/fetchallbooks" . require Auth

router.get('/fetchallbooks', fetchuser, async (req, res) => {

    try {
        const books = await Books.find({ user: req.user.id });
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 1.1: Get All the Books : GET "/api/books/fetchallbooks" . require Auth

router.get('/fetchchild', async (req, res) => {

    try {
        const books = await Books.find({ type: "Disney" }).limit(8);
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 1.2: Get All the Books : GET "/api/books/fetchchild" . require Auth

router.get('/fetchdisney', async (req, res) => {

    try {
        const books = await Books.find({ type: "Child" }).limit(8);
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 1.3: Get All the Books : GET "/api/books/fetchsciencefiction" . require Auth

router.get('/fetchsciencefiction', async (req, res) => {

    try {
        const books = await Books.find({ type: "Science Fiction" }).limit(7);
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})



// ROUTE 1.4: Get All the Books : GET "/api/books/fetchmystery" . require Auth

router.get('/fetchmystery', async (req, res) => {

    try {
        const books = await Books.find({ type: "Mystery" }).limit(8);
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 1.5: Get All the Books : GET "/api/books/fetchcart" . require Auth


router.post('/fetchcart', async (req, res) => {
    const {id} = req.body;
    try {
        const books = await Books.findOne({"_id":id});
        res.json(books)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})




// ROUTE 2: Add a new Books : POST "/api/books/addbooks" . require Auth

router.post('/addbooks', fetchuser, [
    body('title', 'Enter a Valid name').isLength({ min: 3 }),
    body('desc', 'Description must be atleast 5 Chatracters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { name, title, authors, publisher, pages, rating, desc, price, keyword, type, quantity, image, variants, AudioLink, status } = req.body;
            //if ther errors, return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const book = new Books({
                name, title, authors, publisher, pages, rating, desc, price, keyword, type, quantity, image, variants, AudioLink, status
            })
            const saveBook = await book.save();
            res.json(saveBook);

        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update existing Book Books : PUT "/api/books/updatebook" . require Auth

router.put('/updatebook/:id', fetchuser, async (req, res) => {
    const { name, title, authors, publisher, pages, rating, desc, price, keyword, type, quantity } = req.body;

    try {
        //Create a new Book Object
        const newBook = {};
        if (name) { newBook.name = name };
        if (title) { newBook.title = title };
        if (authors) { newBook.authors = authors };
        if (publisher) { newBook.publisher = publisher };
        if (pages) { newBook.pages = pages };
        if (rating) { newBook.rating = rating };
        if (desc) { newBook.desc = desc };
        if (price) { newBook.price = price };
        if (keyword) { newBook.keyword = keyword };
        if (type) { newBook.dtypeesc = type };
        if (quantity) { newBook.quantity = quantity };
        //find the note tot be updated and update it
        let books = await Books.findById(req.params.id);

        if (!books) {
            return res.status(404).send("Not Found")
        }

        if (books.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        books = await Books.findByIdAndUpdate(req.params.id, { $set: newBook }, { new: true });
        res.json({ books })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

})


// ROUTE 4: DELETE existing Book Books : DELETE "/api/books/deletebook" . require Auth

router.delete('/deletebook/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be updated and deleted it
        let books = await Books.findById(req.params.id);

        if (!books) {
            return res.status(404).send("Not Found")
        }

        //Allow deletion only if use owns this Book

        if (books.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        books = await Books.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note Has been Deleted...!", books: books })

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

})

module.exports = router  