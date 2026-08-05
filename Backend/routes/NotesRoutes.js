import express from "express";
import { CreateNote, deleteNote, editNote, findNote, GetAllNotes } from "../controllers/NotesControllers.js";

const Notesroute = express.Router();

// Create a new note (C)
 Notesroute.post('/new-note', CreateNote); 

// Read All Notes (R)
Notesroute.get('/all-notes', GetAllNotes);

// Find a note based on its id
Notesroute.get('/note/:id', findNote);

// Edit/Update a note (U)
Notesroute.put('/edit-note/:id', editNote);

// Delete a Note (D)
Notesroute.delete("/delete-note/:id", deleteNote);

export default Notesroute;