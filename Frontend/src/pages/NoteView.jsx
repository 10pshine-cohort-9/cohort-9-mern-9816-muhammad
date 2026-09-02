import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import axios from "axios";
import { showError, showSuccess, showWarning } from "../utils/reactToastify";

const NoteView = () => {
  const { id } = useParams();
  const [noteData, setnoteData] = useState({});
  const navigate = useNavigate();
  const { BACKEND_URL,token } = useContext(AppContext);

  const [isEdit, setisEdit] = useState(false);
  const [Delete, setDelete] = useState(false);

  const getPlainText = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

  const getNote = async () => {
    try {
      const findedNote = await axios.get(BACKEND_URL + `/note/${id}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setnoteData(findedNote.data);
    } catch (error) {
      showError("Failed to load notes");
      console.log(error);
    }
  };

  const editNote = async () => {
    if(isEdit === true){  
    
      if (!noteData.Title.trim()) {
        showWarning("Please enter a note title")
        return;
      }
    
      if (!noteData.Title.length >= 5) {
        showWarning("Note Title should be of atleast 5 characters")
        return;
      }
            
      const plainContent = getPlainText(noteData.Content).trim()
      if (!plainContent) {
        showWarning("Please enter the Note Content")
        return;
      }

      if (!plainContent.length >= 20) {
        showWarning("Note Content should be of atleast 20 characters")
        return;
      }
       
      try {
      
      const response = await axios.put(BACKEND_URL + `/edit-note/${id}`, noteData,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
        
        showSuccess("Note Updated Successfully")
    } catch (error) {
      showError(error.response?.data?.message || "Note Edit Failed")
      console.log(error)
    }
  }
  }

  const deleteNote = () => {
    if (Delete === true) {
      try {
        axios.delete(BACKEND_URL + `/delete-note/${id}`, {
          headers:{
          Authorization: `Bearer ${token}`
        }
        });
        showSuccess("Note Deleted Successfully")
      } catch (error) {
        showError(error.response?.data?.message || "Note Deletion Failed")
        console.log(error);
      }
    }
  };

  useEffect(() => {
    deleteNote();
  }, [Delete, id]);

  useEffect(() => {
    getNote();
  }, [id]);

  return (
    <section className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
            My Note
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            view, edit and delete your note
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-stone-300 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4">
            {isEdit === false ? (
              <p className="text-xs text-stone-500">
                Created On: {noteData.dateOfCreation}
              </p>
            ) : (
              <input
                type="date"
                value={noteData.dateOfCreation}
                onChange={(event) =>
                  setnoteData((prev) => ({
                    ...prev,
                    dateOfCreation: event.target.value,
                  }))
                }
                className="rounded-md border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs text-stone-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            )}
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 font-semibold">
              {noteData.Category}
            </span>
          </div>

          <div className="mt-5">
            {isEdit ? (
              <input
                type="text"
                value={noteData.Title}
                onChange={(event) =>
                  setnoteData((prev) => ({
                    ...prev,
                    Title: event.target.value,
                  }))
                }
                className="w-full rounded-lg border-stone-300 bg-stone-50 px-3.5 py-2.5 text-lg font-semibold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 "
              />
            ) : (
              <h2 className="text-xl font-semibold sm:text-2xl text-emerald-900">
                Title: {noteData.Title}
              </h2>
            )}
          </div>

          <div className="mt-4">
            {isEdit ? (
              <RichTextEditor value={noteData.Content || ""} onChange={(Content) => setnoteData( (prev) => ({ ...prev, Content }))} />
            ) : (
              <div className ="text-sm sm:text-base leading-relaxed text-stone-600 [&_h1]:mt-2 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-emerald-900
                  [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-emerald-900 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5
                  [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-emerald-700 [&_a]:underline [&_strong]:font-semibold "
                dangerouslySetInnerHTML={{ __html: noteData.Content }} />
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
            {isEdit ? (
              <button
                onClick={async () => {await editNote(), setisEdit(false)}}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5"
              >
                Save
              </button>
            ) : (
              <>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5"
                  onClick={() => setisEdit(true)}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    (deleteNote(), setDelete(true), navigate("/all-notes"));
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoteView;
