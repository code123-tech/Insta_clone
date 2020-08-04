const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: "https://res.cloudinary.com/swap2001/image/upload/v1596295343/unknown_fzdusx.png"
    },
    followers: [{ type: ObjectId, ref: "user" }],
    following: [{ type: ObjectId, ref: "user" }]
});

mongoose.model("user", userSchema);