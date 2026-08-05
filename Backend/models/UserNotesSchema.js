import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    Category: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Content:{
        type: String,
        required: true
    }
})

const Note = mongoose.model('UserNote', NoteSchema);

export default Note;