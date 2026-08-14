import mongoose, { Schema } from "mongoose";

const users = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    encryptedPassword: {
        type: String,
        required: true
    }
})

const NotesAppUsers = mongoose.model("NotesAppUsers", users)

export default NotesAppUsers