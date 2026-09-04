import {expect} from 'chai'
import sinon from 'sinon'

import Note from '../models/UserNotesSchema.js'
import { GetAllNotes, CreateNote, deleteNote, findNote, editNote } from '../controllers/NotesControllers.js'

describe("Unit Tests for Notes Controller", () => {

    describe("CreateNote", () => {
    
      afterEach( ()=> {
        sinon.restore();
    })

    it("Should create a new note successfully", async () => {
       
        const saveStub = sinon.stub().resolves();
        sinon.stub(Note.prototype, "save" ).callsFake(saveStub)

        const req = {
            body: {
                Category: "Test Category",
                Title: "Test title",
                dateOfCreation: "0000-00-00",
                Content: "Test Content"
            }
        }

        const fakeNote = {
            Category: "Test Category",
            Title: "Test title",
            dateOfCreation: "0000-00-00",
            Content: "Test Content"
        }

        const res = {
            json: sinon.spy()
        }

        await CreateNote(req, res);

        sinon.assert.calledOnce(saveStub)

        expect(res.json.calledOnce).to.equal(true)
        expect(res.json.firstCall.args[0]).to.include({
            Category: "Test Category",
            Title: "Test title",
            dateOfCreation: "0000-00-00",
            Content: "Test Content"
        })

    }) 

    it("must return an error if note creation fails", async () => {
        
        sinon.stub(Note.prototype, "save").rejects(new Error("Database Failure"))

        const req = {
            body: {
                Category: "Test Category",
                Title: "Test title",
                dateOfCreation: "0000-00-00",
                Content: "Test Content"
            }
        }

        const res = {
            json: sinon.spy()
        }

        await CreateNote(req, res);

        expect(res.json.calledOnce).to.equal(true)
        expect(res.json.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Error while creating the note"
        })
    })

  })
    
  describe("Get All Notes", ()=> {

    afterEach( ()=> {
        sinon.restore();
    })

    it("Should return all notes successfully", async () => {
        
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

        const findStub = sinon.stub(Note, "find").resolves(notes)

        const req = {}

        const res = {
            json: sinon.spy()
        }

        await GetAllNotes(req, res);

        sinon.assert.calledOnce(findStub)

        expect(res.json.calledOnce).to.equal(true)
        expect(res.json.firstCall.args[0]).to.deep.equal(notes)
    })

    it("must return an error if getting All Notes fails", async () => {
        
        sinon.stub(Note, "find").rejects(new Error("Database Failure"))

        const req = {}

        const res = {
            json: sinon.spy()
        }

        await GetAllNotes(req, res);

        expect(res.json.calledOnce).to.equal(true)
        expect(res.json.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Error while getting the notes"
        })
    })
  })

  describe('findNote', () => {
    
    afterEach( ()=> {
        sinon.restore();
    })

    it("should return the selectd note successfully", async () => {
        
        const note = {
            _id: '321',
            Category: "Test NOte",
            Title: "Test Note Title",
            Content: "Test Content"
        }

        const findByIdStub = sinon.stub(Note, "findById").resolves(note)

        const req = {
            params: {
                id: '321'
            }
        }

        const res = {
            send: sinon.spy(),
            sendStatus: sinon.spy(),
            status: sinon.stub().returnsThis()
        }

        await findNote(req, res);

        sinon.assert.calledOnce(findByIdStub)

        expect(findByIdStub.calledWith("321")).to.equal(true);
        expect(res.send.calledOnce).to.equal(true)
        expect(res.send.firstCall.args[0]).to.deep.equal(note)
    })

    it("must return 404 if note note found", async () => {
        
        sinon.stub(Note, "findById").resolves(null)

         const req = {
            params: {
                id: '321'
            }
        }

        const res = {
            send: sinon.spy(),
            sendStatus: sinon.spy()
        }

        await findNote(req, res);

        expect(res.sendStatus.calledOnce).to.equal(true)
        expect(res.sendStatus.firstCall.args[0]).to.equal(404)
    })

    it("must return 500 if finding the note fails", async () => {
        
        sinon.stub(Note, "findById").rejects(new Error("Database Failure"))

        const req = {
            params: {
                id: '321'
            }
        }

        const res = {
            send: sinon.spy(),
            sendStatus: sinon.spy(),
            status: sinon.stub().returnsThis()
        }

        await findNote(req, res);

        expect(res.status.calledWith(500)).to.equal(true)
        expect(res.send.calledWith("Note finding failed")).to.equal(true)
        
    })
  })

    describe("editNote", () => {

        afterEach(() => {
            sinon.restore();
        });

        it("should edit the note successfully", async () => {

            const editedNote = {
                _id: "321",
                Title: "Updated Title",
                dateOfCreation: "0001-01-10",
                Content: "Updated content"
            };

            const updateStub = sinon.stub(Note, "findByIdAndUpdate").resolves(editedNote);

            const req = {
                params: {
                    id: "321"
                },
                body: {
                    Title: "Updated Title",
                    dateOfCreation: "0001-01-10",
                    Content: "Updated content"
                }
            };

            const res = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            await editNote(req, res);

            sinon.assert.calledOnce(updateStub);

            expect(updateStub.calledWith("321",
                {
                    Title: "Updated Title",
                    dateOfCreation: "0001-01-10",
                    Content: "Updated content"
                },
                {
                    returnDocument: "after",
                    runValidators: true
                })).to.equal(true);

            expect(res.send.calledOnce).to.equal(true);
            expect(res.send.firstCall.args[0]).to.deep.equal(editedNote);
        });

        it("should return 404 if note is not found while editing", async () => {

            sinon.stub(Note, "findByIdAndUpdate").resolves(null);

            const req = {
                params: {
                    id: "123"
                },
                body: {
                    Title: "Updated Title",
                    dateOfCreation: "0001-01-10",
                    Content: "Updated content"
                }
            };

            const res = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            await editNote(req, res);

            expect(res.status.calledWith(404)).to.equal(true);
            expect(res.send.calledWith("Edited note not found or invalid ID")).to.equal(true);
        })

        it("should return an error if editing the note fails", async () => {

            sinon.stub(Note, "findByIdAndUpdate").rejects(new Error("Database error"));

            const req = {
                params: {
                    id: "123"
                },
                body: {
                    Title: "Updated Title",
                    dateOfCreation: "2026-08-25",
                    Content: "Updated content"
                }
            }

            const res = {
                json: sinon.spy()
            }

            await editNote(req, res);

            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.firstCall.args[0]).to.deep.equal({ 
                success: false,
                message: "Error while editing the note"
            });
        });

    })

    describe('deleteNote', () => {

      afterEach(() => {
            sinon.restore();
       });

       it("should delete note successfully", async () => {
        
        const deletedNote = {
                _id: "321",
                Title: "Deleted",
                Content: "Note content"
        }

        const delStub = sinon.stub(Note, "findByIdAndDelete").resolves(deletedNote);

        const req = {
            params: {
                id: '321'
            }
        }

        const res = {
            send: sinon.spy(),
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        }

        await deleteNote(req, res);

        sinon.assert.calledOnce(delStub)

        expect(delStub.calledWith('321')).to.equal(true)
        expect(res.json.calledOnce).to.equal(true)
        expect(res.json.firstCall.args[0]).to.deep.equal(deletedNote)
       })

       it("should return 404 if note is not found while deleting", async () => {

            sinon.stub(Note, "findByIdAndDelete").resolves(null);

            const req = {
                params: {
                    id: "321"
                }
            };

            const res = {
                send: sinon.spy(),
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            await deleteNote(req, res);

            expect(res.status.calledWith(404)).to.equal(true);
            expect(res.send.calledWith("Note not found")).to.equal(true);
        })

        it("must return 500 if Deleting the note fails", async () => {
        
        sinon.stub(Note, "findByIdAndDelete").rejects(new Error("Database Failure"))

        const req = {
            params: {
                id: '321'
            }
        }

        const res = {
            send: sinon.spy(),
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        }

        await deleteNote(req, res);

        expect(res.status.calledWith(500)).to.equal(true)
        expect(res.send.calledWith("Error while deleting the note")).to.equal(true)
        
    })
    })
    

})