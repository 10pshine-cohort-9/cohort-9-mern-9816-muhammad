import express from "express";
import { CreateNote, deleteNote, editNote, findNote, GetAllNotes } from "../controllers/NotesControllers.js";
import userAuthantication from "../middlewares/authMiddleware.js";

const Notesroute = express.Router();

// Create a new note (C)
 Notesroute.post('/new-note', userAuthantication, CreateNote); 

// Read All Notes (R)
Notesroute.get('/all-notes', userAuthantication, GetAllNotes);

// Find a note based on its id
Notesroute.get('/note/:id', userAuthantication, findNote);

// Edit/Update a note (U)
Notesroute.put('/edit-note/:id', userAuthantication, editNote);

// Delete a Note (D)
Notesroute.delete("/delete-note/:id", userAuthantication, deleteNote);

export default Notesroute;