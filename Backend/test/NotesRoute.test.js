import {expect} from 'chai'
import express from 'express'
import sinon from 'sinon'
import  request  from 'supertest'

import Note from '../models/UserNotesSchema.js'
import Notesroute from '../routes/NotesRoutes.js'

const app = express()
app.use(express.json())
app.use('/notes', Notesroute)

describe('Testing the Notes Routes', () => {
  
    afterEach ( ()=> {
        sinon.restore();
    })

  describe('POST /notes/new-note', () => {
    it("should create a new Note successfully", async () => {
        
        sinon.stub(Note.prototype, "save").resolves()

        const res = await request(app).post('/notes/new-note').send({
            Category: "Test Category",
                Title: "Test title",
                dateOfCreation: "0000-00-00",
                Content: "Test Content"
        }) 

        expect(res.status).to.equal(200)
        expect(res.body).to.include({
            Category: "Test Category",
                Title: "Test title",
                dateOfCreation: "0000-00-00",
                Content: "Test Content"
        })
    }) 

  })

  describe('GET /notes/all-notes', () => {
    it("should successfully return the found notes", async () => {
        const notes = [
            {
                _id: '1',
                Category: "Test NOte",
                Title: "Test Note Title",
                Content: "Test Content"
            },
            {
                _id: '2',
                Category: "Test NOte",
                Title: "Test Note Title",
                Content: "Test Content"
            }

        ]

        sinon.stub(Note, "find").resolves(notes)
        const res = await request(app).get('/notes/all-notes')

        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(notes)
    })
  })

  describe('GET /notes/note/:id', () => {
    it("should return the selected note", async () => {
         const note = {
            _id: '321',
            Category: "Test NOte",
            Title: "Test Note Title",
            Content: "Test Content"
        }

        sinon.stub(Note, "findById").resolves(note)

        const res = await request(app).get('/notes/note/321')

        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(note)
    })

    it("must return 404 if the selected note not found", async () => {
        sinon.stub(Note, "findById").resolves(null)

        const res = await request(app).get('/notes/note/321')

        expect(res.status).to.equal(404)
    })
  })

  describe('PUT /notes/edit-note/:id', () => {
    it("should edit a note successfully", async () => {
        const editedNote = {
                _id: "321",
                Title: "Updated Title",
                dateOfCreation: "0001-01-10",
                Content: "Updated content"
            };

            sinon.stub(Note, "findByIdAndUpdate").resolves(editedNote);

            const res = await request(app).put('/notes/edit-note/321').send({
                Title: "Updated Title",
                dateOfCreation: "0001-01-10",
                Content: "Updated content"
            })

            expect(res.status).to.equal(200)
            expect(res.body).to.deep.equal(editedNote)
    })

    it("must return 404 if note is not found while editing", async () => {

            sinon.stub(Note, "findByIdAndUpdate").resolves(null);

            const res = await request(app).put('/notes/edit-note/321').send({
                Title: "Updated Title",
                dateOfCreation: "0001-01-10",
                Content: "Updated content"
            })

            expect(res.status).to.equal(404);
            expect(res.text).to.equal("Edited note not found or invalid ID");
        })

  })

  describe('DELETE /notes/delete-note/:id', () => {
    it("should delete a note successfully", async () => {
        const deletedNote = {
                _id: "321",
                Title: "Deleted",
                Content: "Note content"
        }

        sinon.stub(Note, "findByIdAndDelete").resolves(deletedNote);

        const res = await request(app).delete('/notes/delete-note/321')

        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(deletedNote)
    })

    it("must return 404 when note is not found while Deleting", async () => {
        
        sinon.stub(Note, "findByIdAndDelete").resolves(null)

        const res = await request(app).delete('/notes/delete-note/321')

        expect(res.status).to.equal(404)
        expect(res.text).to.equal("Note not found")
    })
  })
  
  
  
  
    
})
