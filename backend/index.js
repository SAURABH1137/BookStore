const connectToMongo = require("./Database/Connection.js");
const express = require('express')
const cors = require('cors')

connectToMongo();
const app = express();
app.use(cors());
const port = 5000

app.use(express.json())

//Avaiable routes 
app.use('/api/auth',require('./Routes/auth'));
app.use('/api/books',require('./Routes/books'));
app.use('/api/cart',require('./Routes/Cart'));
app.use('/api/review',require('./Routes/review'));
app.use('/api/review',require('./Routes/search'));
app.use('/api/address',require('./Routes/address'));
app.use('/api/card',require('./Routes/card'));
app.use('/api/admin',require('./Routes/admin'));
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})