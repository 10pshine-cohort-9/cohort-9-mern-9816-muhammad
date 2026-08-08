import Note from "../models/UserNotesSchema.js"
import logger from "../logger/logger.js";

const CreateNote = async (req, res) => {
    try {
    const { Category, Title, dateOfCreation, Content } = req.body;
    const newNote = {Category, Title, dateOfCreation, Content}
    // const AddNote = new Note({
    //     Category: newNote.category,
    //     Title: newNote.title,
    //     Content: newNote.content
    // });
    const AddNote = new Note(newNote)
    await AddNote.save();
    logger.info("New Note Created Successfully")
    res.json(AddNote)
} catch (error) {
    logger.error(error)
    res.json({success: false, message: "Error while creating the note"})
}
}

const GetAllNotes = async (req, res) => {
    try {
    const notes =  await Note.find();
    res.json(notes);
    logger.info("All notes are here")     
    } catch (error) {
        logger.error(error)
    }
   
}


const findNote = async (req, res) => {
    const { id } = req.params;
    try {
        const findedNote = await Note.findById(id);
        if (!findedNote) {
            res.send(404);
        }
        else{
            res.send(findedNote)
            logger.info("The selected Note is ready to View")
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Note finding failed")
    }
    
}

const editNote = async (req, res) => {
    const { id } = req.params;
    const { title, DateofCreation, content } = req.body;

    try {
         const editedNote = await Note.findByIdAndUpdate(id, { Title: title, dateofCreation: DateofCreation, Content: content}, {returnDocument: 'after', runValidators: true});
        if (!editedNote) {
            res.status(404).send("Edited note not found or invalid ID")
        } else {
            logger.info(`The Note with id ${id} edited successfully`)
            res.send(editedNote)
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if(!deletedNote){
            res.status(404).send("Note not found")
        }
        else{
            logger.info(`Note with this ID ${id} deleted successfully`);
            res.json(deletedNote);

        }
        
 } catch (error) {
        logger.error(error)
        res.status(500).send("Error while deleting the note");
    }
}

export { GetAllNotes, CreateNote, deleteNote, findNote, editNote }