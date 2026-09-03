import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import NoteView from "./NoteView";

jest.mock("axios");

// Mock context
jest.mock("../context/AppContext.jsx", () => {
  const React = require("react");
  return {
    AppContext: React.createContext({
      BACKEND_URL: "http://localhost:4000/api",
      token: "test-token"
    })
  }
});

// Mock RichTextEditor
jest.mock("../components/RichTextEditor.jsx", () => {
  return function MockRichTextEditor({ value, onChange }) {
    return (
      <textarea data-testid="rich-text-editor" value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }
});

// Mock Toastify
jest.mock("../utils/reactToastify.js", () => ({
  showError: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn()
}))

const toast = require("../utils/reactToastify.js");

const note = {
  _id: "note123",
  Category: "WorkCategory",
  Title: "My Important Note",
  dateOfCreation: "2026-09-02",
  Content: "<p>This is some important note content.</p>"
};

// Helper for rendering the page
const renderNoteView = () => {
  return render(
    <MemoryRouter initialEntries={["/note/note123"]}>
      <Routes>
        <Route path="/note/:id" element={<NoteView />} />
        <Route path="/all-notes" element={<div> All Notes Page </div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("NoteView Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();

    axios.get.mockResolvedValue({ data: note });
  });

  test("should load and display the note", async () => {
   
    renderNoteView();

    expect(await screen.findByText("My Note")).toBeInTheDocument();

    await waitFor(() => {
    expect(screen.getByText("WorkCategory")).toBeInTheDocument();
    expect(screen.getByText("Title: My Important Note")).toBeInTheDocument();
    expect(screen.getByText("Created On: 2026-09-02")).toBeInTheDocument();
});

    expect(axios.get).toHaveBeenCalledWith("http://localhost:4000/api/note/note123", {
        headers: {
          Authorization: "Bearer test-token"
        }
      }
    )
  });

  test("should show an error when note cannot be loaded", async () => {
   
    axios.get.mockRejectedValue(new Error("Request failed"));

    renderNoteView();

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith("Failed to load notes")
    })
  });

  test("should enter edit mode when Edit button is clicked", async () => {
    
    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByDisplayValue("My Important Note")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()

  });

  test("should allow changing the title in edit mode", async () => {
    
    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const titleInput = screen.getByDisplayValue("My Important Note");

    fireEvent.change(titleInput, { target: { value: "Updated Note Title" }});

    expect(titleInput).toHaveValue("Updated Note Title");

  });

  test("should allow changing the note content", async () => {

    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const editor = screen.getByTestId("rich-text-editor");

    fireEvent.change(editor, { target: { value: "<p>This is the updated note content with enough text.</p>"}});

    expect(editor).toHaveValue("<p>This is the updated note content with enough text.</p>")

  });

  test("should show warning when title is empty while editing", async () => {

    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const titleInput = screen.getByDisplayValue("My Important Note");

    fireEvent.change(titleInput, {target: { value: "" }});

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(toast.showWarning).toHaveBeenCalledWith("Please enter a note title")
    expect(axios.put).not.toHaveBeenCalled()

  });

  test("should show warning when title is less than 5 characters", async () => {
    
    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const titleInput = screen.getByDisplayValue("My Important Note");

    fireEvent.change(titleInput, {target: { value: "Test" }})
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(toast.showWarning).toHaveBeenCalledWith("Note Title should be of atleast 5 characters")
    expect(axios.put).not.toHaveBeenCalled()

  });

  test("should show warning when content is empty while editing", async () => {
    
    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const editor = screen.getByTestId("rich-text-editor");

    fireEvent.change(editor, {target: { value: "" }});
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(toast.showWarning).toHaveBeenCalledWith("Please enter the Note Content")
    expect(axios.put).not.toHaveBeenCalled()

  });

  test("should show warning when content is less than 20 characters", async () => {
    
    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const editor = screen.getByTestId("rich-text-editor");

    fireEvent.change(editor, {target: { value: "<p>Short content</p>" }})
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(toast.showWarning).toHaveBeenCalledWith("Note Content should be of atleast 20 characters")
    expect(axios.put).not.toHaveBeenCalled()

  });

  test("should update the note successfully", async () => {
    
    axios.put.mockResolvedValue({ data: { success: true } });

    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const titleInput = screen.getByDisplayValue("My Important Note");

    fireEvent.change(titleInput, {target: { value: "Updated Note Title" }});

    const editor = screen.getByTestId("rich-text-editor");

    fireEvent.change(editor, {target: {value: "<p>This is the updated note content with enough text.</p>"}});
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("http://localhost:4000/api/edit-note/note123",
        {
          ...note,
          Title: "Updated Note Title",
          Content:"<p>This is the updated note content with enough text.</p>"
        },
        {
          headers: {
            Authorization: "Bearer test-token"
          }
        }
      )
    });

    expect(toast.showSuccess).toHaveBeenCalledWith("Note Updated Successfully")

  });

  test("should show error when updating the note fails", async () => {
    
    axios.put.mockRejectedValue({response: { data: { message: "Note update failed" }} })

    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith("Note update failed")
    })

  })

  test("should delete the note when Delete is clicked", async () => {
    axios.delete.mockResolvedValue({data: { success: true } });

    renderNoteView();

    await screen.findByText("Title: My Important Note");

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("http://localhost:4000/api/delete-note/note123", {
          headers: {
            Authorization: "Bearer test-token"
          }
        }
      )
    })

    expect(await screen.findByText("All Notes Page")).toBeInTheDocument()

  })
});

