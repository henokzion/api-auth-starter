const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");


const app = express();

//Middlewares 

//Routes

//Server
const PORT = process.env.PORT || 8000;

app.listen(PORT);

console.log(`Server listening at ${PORT}`);