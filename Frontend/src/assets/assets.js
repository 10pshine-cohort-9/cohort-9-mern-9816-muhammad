import
{NotebookText, Search, Tags, Cone, ArrowRight, Menu, X,
PenLine, BookMarked, Trash2 } from 'lucide-react'
export const CardFeatures = [
    {
        'id' : "Card 1",
        'title' : "Note Instantly",
        'icon': Tags,
        'desc' : "Create a new note and file your ideas intantly",
        'rotate' : "-rotate-2"
    },
    {
        'id' : "Card 2",
        'title' : "Edit your note",
        'icon': PenLine,
        'desc' : "Edit an existing note and file your ideas more clearly",
        'rotate' : "rotate-1"
    },
    {   'id' : "Card 3",
        'title' : "Delete a Note",
        'icon': Trash2,
        'desc' : "Delete a note if you have no longer need of it",
        'rotate' : "-rotate-1"
    },
    {   'id' : "Card 4",
        'title' : "Filter your Note Instantly",
        'icon': Cone,
        'desc' : "Filter your notes based on a specfic title",
        'rotate' : "rotate-2"}
]
import notePadpicture from './notePadpicture.jpg'
import bannerimage from './bannerimage.jpg'
export const assets = {
    notePadpicture,
    bannerimage
}