require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const { MONGOURL } = require('./config/keys')

mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.connection.on('connected', (error) => {
    if (!error) {
        console.log("connected succesfully to mongo");
    } else {
        console.log("Not Connected, ", error);
    }
});

require('./Models/user');
require('./Models/post');

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log("Server started Successfully at Port " + PORT);
});