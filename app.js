const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors");

mongoose.connect("mongodb://localhost/Briter", {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true 
});

const app = express();

//Middlewares 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors())
//Routes

app.use("/", require("./src"))
//Server
const PORT = process.env.PORT || 8000;

app.listen(PORT);

console.log(`Server listening at ${PORT}`);