import
{NotebookText, Search, Tags, Cone, ArrowRight, Menu, X,
PenLine, BookMarked, Trash2, Eye, ChevronDown, ImageUp} from 'lucide-react' 
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
    bannerimage,
    Eye,
    ChevronDown,
    ImageUp
}

export const dummyNotes = [
    {
        'id' : "note-1",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'   
    },
    {
        'id' : "note-2",
         'category': "Personal",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-3",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-4",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-5",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-6",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-7",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-8",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-9",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-10",
         'category': "Work",
         'title': 'Monday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-11",
         'category': "Gaming",
         'title': 'Gaming Competition',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    },
    {
        'id' : "note-12",
         'category': "Daily Routine",
         'title': 'Sunday-Schedule',
         'content': 'I will go office and attend the meeting and then start my task.',
         'DateofCreation': '01-02-2026'
    }
]

import profile_pic from './profile_pic.png'
export const userProfile = {
    'image': profile_pic,
     'Name': 'Abc',
     'Email': 'abc@gmail.com',
     'Gender': 'Male',
     'Dob': '00-00-2006',
      'Tel': '03**-*******',
      'Address': {
        'house': "xyz",
        'CityState': 'City, Country'
      }
}