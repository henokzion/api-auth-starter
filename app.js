const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/LearningIDE");

const app = express();

//Middlewares 
app.use(morgan('dev'));
app.use(bodyParser.json());
//Routes

app.use("/", require("./routes"))
//Server
const PORT = process.env.PORT || 8000;

app.listen(PORT);

console.log(`Server listening at ${PORT}`);