import React from "react";
import axios from "axios";
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";
const CreateNote = () => {
  const { BACKEND_URL } = useContext(AppContext);

  const [Category, setCategory] = useState("");
  const [Title, setTitle] = useState("");
  const [dateOfCreation, setDateofCreation] = useState("");
  const [Content, setContent] = useState("");

  const submitNote = async (event) => {
    // it will prevent the default submission
    event.preventDefault();
    
    try {
      const response = await axios.post(BACKEND_URL + "/new-note", {
        Category,
        Title,
        dateOfCreation,
        Content,
      });

      // It will clear the input fields after form submission
      setCategory("");
      setTitle("");
      setDateofCreation("");
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto my-20 w-full max-w-lg px-4 sm:px-0">
      <div className="rounded-2xl border border-stone-400 bg-white shadow-lg shadow-stone-600/60 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
          Create A Note:
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          File a new note into your notesbook
        </p>
        <div>
          <form
            action=""
            method=""
            onSubmit={(event) => submitNote(event)}
            className="flex flex-col mt-6 gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="category"
                className="text-xs font-semibold uppercase tracking-wide text-stone-600"
              >
                Add Category:
              </label>
              <input
                type="text"
                id="category"
                value={Category}
                placeholder="e.g work, personal, idea"
                required
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wide text-stone-600"
              >
                Add a title:
              </label>
              <input
                type="text"
                id="title"
                value={Title}
                required
                placeholder="Give a title to your note"
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dateOfCreation"
                className="text-xs font-semibold uppercase tracking-wide text-stone-600"
              >
                Date:
              </label>
              <input
                type="date"
                id="dateOfCreation"
                value={dateOfCreation}
                required
                onChange={(event) => {
                  setDateofCreation(event.target.value);
                }}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 sm:w-48"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="content"
                className="text-xs font-semibold uppercase tracking-wide text-stone-600"
              >
                Add Content:
              </label>
              <RichTextEditor value={Content} onChange={setContent} />
              {/* <textarea
                id="content"
                rows={5}
                cols={30}
                value={Content}
                placeholder="start typing"
                onChange={(event) => setContent(event.target.value)}
                className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              ></textarea> */}
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full sm:w-auto sm:self-end items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-1"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
