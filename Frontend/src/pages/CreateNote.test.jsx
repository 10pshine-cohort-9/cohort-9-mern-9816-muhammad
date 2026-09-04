import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import CreateNote from "./CreateNote";

jest.mock("axios");

// Mock AppContext
jest.mock("../context/AppContext.jsx", () => {
  const React = require("react");
  return {
    AppContext: React.createContext({
      BACKEND_URL: "http://localhost:4000/api",
      token: "test-token",
    })
    };
})

// Mock RichTextEditor
jest.mock("../components/RichTextEditor.jsx", () => {
  return function MockRichTextEditor({ value, onChange }) {
    return (
      <textarea data-testid="rich-text-editor" value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }
});

// Mock NoteImportExport
jest.mock("../components/NoteImportExport.jsx", () => {
  return function MockNoteImportExport({ title, content, onImport }) {
    return (
      <div data-testid="note-import-export">
        <span data-testid="import-title">{title}</span>
        <span data-testid="import-content">{content}</span>

        <button type="button" onClick={() => onImport({ title: "Imported Note", content: "<p>Imported note content</p>" })}>
          Import Test Note
        </button>
      </div>
    )
  }
});

// Mock Toastify
jest.mock("../utils/reactToastify.js", () => ({
  showError: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn(),
}))

const toast = require("../utils/reactToastify.js");

// Helper
const renderCreateNote = () => {
  return render(
    <MemoryRouter initialEntries={["/create-note"]}>
      <Routes>
        <Route path="/create-note" element={<CreateNote />} />
        <Route path="/all-notes" element={<div>All Notes Page</div>}/>
      </Routes>
    </MemoryRouter>
  )
}

describe("CreateNote Page", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockReset();
  })

  test("should render CreateNote page correctly", () => {

    renderCreateNote();

    expect(screen.getByRole("heading", { name: "Create A Note:" })).toBeInTheDocument()
    expect(screen.getByText("File a new note into your notesbook")).toBeInTheDocument()

    expect(screen.getByLabelText("Add Category:")).toBeInTheDocument();
    expect(screen.getByLabelText("Add a title:")).toBeInTheDocument()
    expect(screen.getByLabelText("Date:")).toBeInTheDocument();

    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument()
    expect(screen.getByTestId("note-import-export")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  });

  test("should require all input fields", () => {

    renderCreateNote();

    expect(screen.getByLabelText("Add Category:")).toBeRequired();
    expect(screen.getByLabelText("Add a title:")).toBeRequired();
    expect(screen.getByLabelText("Date:")).toBeRequired();
 
 })

  test("should allow user to enter note information", () => {

    renderCreateNote();

    const category = screen.getByLabelText("Add Category:");
    const title = screen.getByLabelText("Add a title:");
    const date = screen.getByLabelText("Date:");
    const content = screen.getByTestId("rich-text-editor");

    fireEvent.change(category, { target: { value: "Work" }})
    fireEvent.change(title, { target: { value: "My Important Note" }})
    fireEvent.change(date, { target: { value: "2026-09-02" }});
    fireEvent.change(content, { target: { value: "This is my important note content."}})

    expect(category).toHaveValue("Work");
    expect(title).toHaveValue("My Important Note");
    expect(date).toHaveValue("2026-09-02");
    expect(content).toHaveValue("This is my important note content.");
  
 })

  test("should show warning when category is empty", () => {
    
    renderCreateNote();

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    expect(toast.showWarning).toHaveBeenCalledWith("Please enter a Note Category")
    expect(axios.post).not.toHaveBeenCalled()
  });

test("should show warning when category is less than 5 characters", () => {
  
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "Work" }});
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Valid Title" }});
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }});
    fireEvent.change(screen.getByTestId("rich-text-editor"), {target: {value: "This is valid note content with more than twenty characters.",
    },
  });

  const form = screen.getByRole("button", { name: "Save" }).closest("form");

  fireEvent.submit(form);

  expect(toast.showWarning).toHaveBeenCalledWith("Note Category should be of atleast 5 characters");
  expect(axios.post).not.toHaveBeenCalled();

})

  test("should show warning when title is empty", () => {
    
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), { target: { value: "WorkCategory" }})

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    expect(toast.showWarning).toHaveBeenCalledWith("Please enter a Note Title");
    expect(axios.post).not.toHaveBeenCalled();
  })

  test("should show warning when title is less than 5 characters", () => {
  
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "WorkCategory" }});
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Test" }});
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }});
    fireEvent.change(screen.getByTestId("rich-text-editor"), {target: {value: "This is valid note content with more than twenty characters.",
    }
  });

  const form = screen.getByRole("button", { name: "Save" }).closest("form");

  fireEvent.submit(form);

  expect(toast.showWarning).toHaveBeenCalledWith("Note Title should be of atleast 5 characters");
  expect(axios.post).not.toHaveBeenCalled()

});

  test("should show warning when date is not selected", () => {
    
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), { target: { value: "WorkCategory" }})

    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Important Title" }})

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    expect(toast.showWarning).toHaveBeenCalledWith( "Please select the Date")
    expect(axios.post).not.toHaveBeenCalled();

  })

  test("should show warning when note content is empty", () => {
   
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "WorkCategory" }})
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Important Title" }})
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }})

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    expect(toast.showWarning).toHaveBeenCalledWith("Please enter the Note Content");
    expect(axios.post).not.toHaveBeenCalled();

  })

  test("should show warning when note content is less than 20 characters", () => {
  
    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "WorkCategory" }});
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Important Title" }})
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }});
    fireEvent.change(screen.getByTestId("rich-text-editor"), {target: {value: "<p>Short content</p>"}})

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);
    fireEvent.change(screen.getByLabelText("Add Category:"), { target: { value: "WorkCategory" }})

    expect(toast.showWarning).toHaveBeenCalledWith("Note Content should be of atleast 20 characters");
    expect(axios.post).not.toHaveBeenCalled();

});

  test("should create note successfully", async () => {

    axios.post.mockResolvedValue({data: { success: true}})

    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "WorkCategory" } });
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Important Title" }});
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }});
    fireEvent.change(screen.getByTestId("rich-text-editor"), {target: {value: "<p>This is a long enough note content for testing.</p>"} });

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:4000/api/new-note",
        {
          Category: "WorkCategory",
          Title: "Important Title",
          dateOfCreation: "2026-09-02",
          Content: "<p>This is a long enough note content for testing.</p>"
        },
        {
          headers: {
            Authorization: "Bearer test-token"
          }
        }
      )
    })

    expect(toast.showSuccess).toHaveBeenCalledWith("Note Created Successfully");
    expect(await screen.findByText("All Notes Page")).toBeInTheDocument();
 
})

  test("should handle note creation API error", async () => {
    
    axios.post.mockRejectedValue({response: {data: { message: "Note already exists" }}});

    renderCreateNote();

    fireEvent.change(screen.getByLabelText("Add Category:"), {target: { value: "WorkCategory" }})
    fireEvent.change(screen.getByLabelText("Add a title:"), {target: { value: "Important Title" }});
    fireEvent.change(screen.getByLabelText("Date:"), {target: { value: "2026-09-02" }});
    fireEvent.change(screen.getByTestId("rich-text-editor"), {target: {value: "<p>This is a long enough note content for testing.</p>"}});

    const form = screen.getByRole("button", { name: "Save" }).closest("form");

    fireEvent.submit(form);

    await waitFor(() => {
        expect(toast.showError).toHaveBeenCalledWith("Note already exists");
    })
  });

  test("should import note information", () => {
    
    renderCreateNote();

    fireEvent.click(screen.getByRole("button", { name: "Import Test Note" }))

    expect(screen.getByTestId("import-title")).toHaveTextContent("Imported Note")
    expect(screen.getByTestId("import-content")).toHaveTextContent("<p>Imported note content</p>")

  });
  
})