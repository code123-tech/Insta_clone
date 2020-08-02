require('dotenv').config();
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys')
const requiredLogin = require("../middleware/requireLogin");

router.get("/protected", requiredLogin, (req, res) => {
    res.send("Hello User");
})

router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please fill all the fields." });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exist with that email." });
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic: pic
                    });
                    user.save().then(user => {
                        res.json({ message: "saved successfully" });
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });
        })
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please provide email or password" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "invalid email or password" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.status(200).json({ message: "successfully signed  in." });
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, pic } = savedUser;
                        res.json({ token, user: { _id, name, email, followers, following, pic } });
                    } else {
                        return res.status(422).json({ error: "invalid email or password" });
                    }
                }).catch(err => { console.log(err); });
        })
});
module.exports = router;