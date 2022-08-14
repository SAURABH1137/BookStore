const express = require("express");
const Books = require('../Models/Books');
const router = express.Router();

router.get('/search/:key', async (req, res) => {
    try {
        let data =  await Books.find(
            {
                "$or":[
                    {
                        "name":{$regex:req.params.key}
                    },
                    {
                        "keyword":{$regex:req.params.key}
                    },
                    {
                        "type":{$regex:req.params.key}
                    }
                ]
            }
        )
        
        res.send(data)
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router 