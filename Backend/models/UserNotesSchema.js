import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    // UserId:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'UserProfile'
    // },
    Category: {
        type: String,
        required: true,
        minLength: 5
    },
    Title: {
        type: String,
        required: true,
        minLength: 5
    },
    dateOfCreation: {
        type: String,
        required: true
    },
    Content:{
        type: String,
        required: true,
        minLength: 20
    }
})

const Note = mongoose.model('UserNote', NoteSchema);

export default Note;