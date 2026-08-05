import Note from "../models/UserNotesSchema.js"
import logger from "../logger/logger.js";

const CreateNote = async (req, res) => {
    try {
    const { category, title, content } = req.body;
    const newNote = {category, title, content}
    const AddNote = new Note({
        Category: newNote.category,
        Title: newNote.title,
        Content: newNote.content
    });
    await AddNote.save();
    logger.info("New Note Created Successfully")
    res.json(AddNote)
} catch (error) {
    logger.error(error)
    res.send("Error creating note", error)
}
}

const GetAllNotes = async (req, res) => {
    const notes =  await Note.find();
    res.json(notes);
    logger.info("All notes are here")
}


const findNote = async (req, res) => {
    const { id } = req.params;
    const findedNote = await Note.findById(id);
    res.send(findedNote)
}

const editNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const editedNote = await Note.findByIdAndUpdate(id, {Title: title, Content: content})
        logger.info(`The Note with id ${id} edited successfully`)
        res.send(editedNote)
    } catch (error) {
        logger.error(error)
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        logger.info(`Note with this ID ${id} deleted successfully`);
        res.json(deletedNote);

 } catch (error) {
        logger.error(error)
        res.status(500).send("Error while deleting the note");
    }
}

export { GetAllNotes, CreateNote, deleteNote, findNote, editNote }