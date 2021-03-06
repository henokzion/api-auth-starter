const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors");

const { handleError } = require('./src/_helpers/error')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { MONGO_URI } =  require("./config");

mongoose.connect( MONGO_URI , {
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

//Error handling
app.use((err, req, res, next) => {
    handleError(err, res);
});

//Server
const PORT = process.env.PORT || 8000;

app.listen(PORT);

console.log(`Server listening at ${PORT}`);