import Note from "../models/UserNotesSchema.js"
import logger from "../logger/logger.js";

const CreateNote = async (req, res) => {

    try {
    const { Category, Title, dateOfCreation, Content } = req.body;

            if (!Category.trim()) {
            return res.status(400).json({
                   success: false,
                   message: "Category is required"
                })
            }

            if (!Category.length >= 5) {
            return res.status(400).json({
                   success: false,
                   message: "Note Category should be of atleast 5 characters"
                }) 
            }

            if (!Title.trim()) {
            return res.status(400).json({
                   success: false,
                   message: "Title is required"
                })
            }

            if (!Title.length >= 5) {
            return res.status(400).json({
                   success: false,
                   message: "Note Title should be of atleast 5 characters"
               }) 
            }

            if (!dateOfCreation) {
            return res.status(400).json({
                   success: false,
                   message: "Select Date"
               })
            }

            const plainContent =  Content?.replace(/<[^>]*>/g, "").trim() || "";
            if (!plainContent) {
            return res.status(400).json({
                   success: false,
                   message: "Content is required"
               })
            }    
            if (!plainContent.length >= 20) {
            return res.status(400).json({
                   success: false,
                   message: "Note Content should be of atleast 20 characters"
               }) 
            }

    const UserId = req.UserId
    const newNote = {UserId, Category, Title, dateOfCreation, Content}
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
    const notes =  await Note.find({UserId: req.UserId});
    res.json(notes);
    logger.info("All notes are here")     
    } catch (error) {
        logger.error(error)
        res.json({success: false, message: "Error while getting the notes"})
    }
   
}


const findNote = async (req, res) => {
    const { id } = req.params;
    try {
        const findedNote = await Note.findOne({_id: id, UserId: req.UserId});
        if (!findedNote) {
            res.sendStatus(404);
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
    const { Title, dateOfCreation, Content } = req.body;

            if (!Title.trim()) {
            return res.status(400).json({
                   success: false,
                   message: "Title is required"
                })
            }

            if (!Title.length >= 5) {
            return res.status(400).json({
                   success: false,
                   message: "Note Title should be of atleast 5 characters"
               }) 
            }

            if (!dateOfCreation) {
            return res.status(400).json({
                   success: false,
                   message: "Select Date"
               })
            }

            //const plainContent = getPlainText(Content).trim()
            const plainContent =  Content?.replace(/<[^>]*>/g, "").trim() || "";
            if (!plainContent) {
            return res.status(400).json({
                   success: false,
                   message: "Content is required"
               })
            }    
            if (!plainContent.length >= 20) {
            return res.status(400).json({
                   success: false,
                   message: "Note Content should be of atleast 20 characters"
               }) 
            }
             
    try {
         const editedNote = await Note.findOneAndUpdate({_id: id, UserId: req.UserId}, { Title: Title, dateOfCreation: dateOfCreation, Content: Content}, {returnDocument: 'after', runValidators: true});
        if (!editedNote) {
            res.status(404).send("Edited note not found or invalid ID")
        } else {
            logger.info(`The Note with id ${id} edited successfully`)
            res.send(editedNote)
        }
    } catch (error) {
        logger.error(error)
        res.json({success: false, message: "Error while editing the note"})
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await Note.findOneAndDelete({_id: id, UserId: req.UserId});
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