import React from "react"
import {screen, render, fireEvent, waitFor} from "@testing-library/react"
import { data, MemoryRouter, Route, Routes } from "react-router-dom"
import axios from "axios"
import { assets } from "../assets/assets"
import AllNotes from './AllNotes'

//Mock the Axios
jest.mock("axios")

//Mock teh App Context
jest.mock("../context/AppContext", () => {
    const React = require('react')
    return{
        AppContext: React.createContext({
            BACKEND_URL: "http://localhost:4000/api",
            token : "test-token"
        })
    }
})

//Mock the Assets
jest.mock("../assets/assets", () => ({
    assets: {
        Eye: () => {
            <span data-testid = 'eye-icon'>Eye</span>
        }
    }
}))

//Mock the Toastify
jest.mock("../utils/reactToastify", () => ({
    showError: jest.fn(),    
    showSuccess: jest.fn(),    
    showWarning: jest.fn(),    
}))

jest.mock("./NoteView", () => () => ( <div data-testid="note-view">Note View</div> ));

const renderAllNotes = () => {
    return render(
        <MemoryRouter> <AllNotes/> </MemoryRouter>
    )
}

describe('All Notes Page', () => {
  
    beforeEach( ()=> {
        jest.clearAllMocks();
        axios.post.mockReset();
    })

    test('should render All Notes Page correctly', async () => {
      
        axios.get.mockResolvedValue({ data: [] })

        renderAllNotes();

        expect(screen.getByText("Find Your Notes")).toBeInTheDocument()
        expect(screen.getByRole("heading", {name: "Your All Notes Available"})).toBeInTheDocument()
        expect(screen.getByText("Select a note which you want to review")).toBeInTheDocument()
        expect(screen.getByText("Notes Categories")).toBeInTheDocument()

        expect(screen.getByRole("button", {name: "All Notes"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Work"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Personal"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Grocery"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Ideas"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Others"})).toBeInTheDocument()

        await waitFor( ()=> {
            expect(axios.get).toHaveBeenCalledWith("http://localhost:4000/api/all-notes", {
                headers: {
                    Authorization: "Bearer test-token"
                }
            })
        })
    })

    test('should fetch All Notes from Backend', async () => {
      
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
                Title: "Test Note Title 1",
                Content: "Test Content"
            }

        ]

        axios.get.mockResolvedValue({ data: notes })

        renderAllNotes();

        await waitFor( ()=> {
            expect(axios.get).toHaveBeenCalledTimes(1)
        })

        expect(await screen.findByText("Test Note Title")).toBeInTheDocument();
        expect(screen.getByText("Test Note Title 1")).toBeInTheDocument();
    })

    test('should display Notes correctly', async () => {
      
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Project Documentation",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        },
      ],
        })

        renderAllNotes();

        expect(await screen.findByText("Project Documentation")).toBeInTheDocument();
        expect(screen.getByText("Work")).toBeInTheDocument();
        expect(screen.getByText("2026-08-30")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "View Note"})).toBeInTheDocument();


    })

    test('should filter Notes by Work category', async () => {
      
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Work Meeting",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Personal Diary",
          Category: "Personal",
          dateOfCreation: "2026-08-31",
        }
      ],
      })

        renderAllNotes();

        expect(await screen.findByText("Work Meeting")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Work"}));
        expect(screen.getByText("Work Meeting")).toBeInTheDocument();
        expect(screen.queryByText("Personal Diary")).not.toBeInTheDocument();

    })
    
    test('should filter Notes by Personal category', async () => {
      
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Work Meeting",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Personal Diary",
          Category: "Personal",
          dateOfCreation: "2026-08-31",
        }
      ],
      })

        renderAllNotes();

        expect(await screen.findByText("Personal Diary")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Personal"}));
        expect(screen.getByText("Personal Diary")).toBeInTheDocument();
        expect(screen.queryByText("Work Meeting")).not.toBeInTheDocument();
    })

    test('should filter Notes by Grocery category', async () => {
      
         axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Grocery List",
          Category: "Grocery",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Personal Diary",
          Category: "Personal",
          dateOfCreation: "2026-08-31",
        }
      ],
      })

        renderAllNotes();

        expect(await screen.findByText("Grocery List")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Grocery"}));
        expect(screen.getByText("Grocery List")).toBeInTheDocument();
        expect(screen.queryByText("Personal Diary")).not.toBeInTheDocument();
    })
    
    test('should filter Notes by Ideas category', async () => {
      
         axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Ideas List",
          Category: "Ideas",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Personal Diary",
          Category: "Personal",
          dateOfCreation: "2026-08-31",
        }
      ],
      })

        renderAllNotes();

        expect(await screen.findByText("Ideas List")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Ideas"}));
        expect(screen.getByText("Ideas List")).toBeInTheDocument();
        expect(screen.queryByText("Personal Diary")).not.toBeInTheDocument();
    })
    
    test('should filter Notes by Others category', async () => {
      
         axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Ideas List",
          Category: "Ideas",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Other Notes",
          Category: "Random",
          dateOfCreation: "2026-08-31",
        }
      ],
      })

        renderAllNotes();

        expect(await screen.findByText("Ideas List")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Others"}));
        expect(screen.getByText("Other Notes")).toBeInTheDocument();
        expect(screen.queryByText("Ideas List")).not.toBeInTheDocument();
    })

    test("should show all notes when All Notes category is selected", async () => {
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Work Note",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        },
        {
          _id: "2",
          Title: "Personal Note",
          Category: "Personal",
          dateOfCreation: "2026-08-31",
        }
      ]
        })

        renderAllNotes();

        expect(await screen.findByText("Work Note")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Personal" }));

        expect(screen.getByText("Personal Note")).toBeInTheDocument();
        expect(screen.queryByText("Work Note")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "All Notes" }));

        expect(screen.getByText("Work Note")).toBeInTheDocument();
        expect(screen.getByText("Personal Note")).toBeInTheDocument();
    });

    test("should show no notes message when category has no notes", async () => {
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Work Meeting",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        }
        ]
        })

        renderAllNotes();

        expect(await screen.findByText("Work Meeting")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Grocery" }));

        expect(screen.getByText("No Notes found for this category")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "View All Notes" })).toBeInTheDocument()
    })

    test("should return to All Notes when View All Notes is clicked", async () => {
        axios.get.mockResolvedValue({ data: [
        {
          _id: "1",
          Title: "Work Meeting",
          Category: "Work",
          dateOfCreation: "2026-08-30",
        }
        ]
        })

        renderAllNotes();

        expect(await screen.findByText("Work Meeting")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Personal" }));

        expect(screen.getByText("No Notes found for this category")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "View All Notes" }))

        expect(screen.getByText("Work Meeting")).toBeInTheDocument();
    })

    test("should navigate to NoteView when View Note is clicked", async () => {
        axios.get.mockResolvedValue({ data: [
        {
            _id: "001",
            Title: "Important Note",
            Category: "Work",
            dateOfCreation: "2026-08-30",
        }
        ]
        })

        render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<AllNotes />} />
                <Route path="/NoteView/:id" element={<div>Note View Page</div>}/>
            </Routes>
        </MemoryRouter>
        );

        expect(await screen.findByText("Important Note")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /View Note/i }))

        expect(await screen.findByText("Note View Page")).toBeInTheDocument()
    })

    test("should handle API error without crashing", async () => {
        axios.get.mockRejectedValue(new Error("Network Error"));

        renderAllNotes();

        await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText("No Notes found for this category")).toBeInTheDocument();
    });

})

