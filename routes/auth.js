require('dotenv').config();
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("user");
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, EMAIL } = require('../config/keys');
const nodemailer = require("nodemailer");
// const { networkInterfaces } = require('os');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const sgMail = require('@sendgrid/mail');
// 

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'swapnilagarwal2001@gmail.com',
        pass: EMAIL
    }
})




router.post('/signup', (req, res) => {
    // console.log(req.body);
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    })

                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                from: 'swapnilagarwal2001@gmail.com',
                                to: user.email,
                                subject: 'Signup Success',
                                html: '<h1> Welcome To WebPics2020 </h1>',
                            }, (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent successfully');
                                }
                            });
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

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

router.post("/reset-password", (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesn't exist with that mail" })
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000
                    // console.log(user.expireToken);
                user.save().then((result) => {
                    transporter.sendMail({
                        from: 'swapnilagarwal2001@gmail.com',
                        to: user.email,
                        subject: 'password Reset.',
                        html: `<p>Your Request For Password Reset</p>
                            <h5>Click On this click <a href="https://webpics2020.herokuapp.com/reset/${token}">link</a> to rest Password</h5>
                        `
                    }, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent successfully');
                        }
                    });
                    res.json({ message: "Check Your Email." })
                })
            })
    })
})

router.post("/new-password", (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try Again session expired." })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword;
                user.resetToken = undefined;
                // user.expireToken = undefined;
                user.save().then((savedUser) => {
                    res.json({ message: "password Updated Success" })
                })
            })
        }).catch(err => {
            console.log(err);
        })
})
module.exports = router;