import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import NoteView from "./NoteView";
import axios from "axios";

const AllNotes = () => {
  const Categories = [
    "All Notes",
    "Work",
    "Personal",
    "Grocery",
    "Ideas",
    "Others",
  ];
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(AppContext);
  const [Notes, setNotes] = useState([]);

  const getAllNotes = async () => {
    try {
      const note = await axios.get(BACKEND_URL + "/all-notes");
      setNotes(note.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedCategorie, setselectedCategorie] = useState("All Notes");
  const [selectedNotes, setselectedNotes] = useState([]);

  const filteredNotes = () => {
    if (selectedCategorie === "All Notes") {
      setselectedNotes(Notes);
    } else if (selectedCategorie === "Others") {
      setselectedNotes(
        Notes.filter((Note) => Categories.includes(Note.Category) === false),
      );
    } else {
      setselectedNotes(
        Notes.filter((Note) => Note.Category === selectedCategorie),
      );
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  useEffect(() => {
    filteredNotes();
  }, [Notes, selectedCategorie]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-emerald-500">
          Find Your Notes
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl">
          Your All Notes Available
        </h1>
        <p className="mt-3 text-sm leading-6 text-emerald-900 sm:text-base">
          Select a note which you want to review
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-2xl border border-stone-500 bg-white p-4 shadow-sm">
            <h2 className="px-2 text-sm font-bold uppercase tracking-wider text-emerald-900">
              Notes Categories
            </h2>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {Categories.map((Categorie) => (
                <button
                  key={Categorie}
                  onClick={() => setselectedCategorie(Categorie)}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    selectedCategorie === Categorie
                      ? "bg-stone-300 text-stone-700 shadow-md shadow-stone-400"
                      : "bg-stone-50 text-emerald-900 hover:bg-stone-300 hover:text-emerald-600"
                  }`}
                >
                  {Categorie}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-800">
              {selectedCategorie}
            </h2>
          </div>
          {selectedNotes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {selectedNotes.map((item) => (
                <div
                  key={item._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-300 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-stone-300"
                >
                  <div className="h-1.5 w-full bg-emerald-500/80" />
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="text-xs text-stone-500">
                        {item.dateOfCreation}
                      </span>
                    </div>
                    <h1 className="mt-2 truncate text-sm sm:text-base font-semibold text-emerald-900">
                      {item.Title}
                    </h1>
                    <p className="mt-1.5 py-3 px-0.5 flex-1 text-xl font-semibold bg-slate-100 border border-emerald-300 rounded-lg text-center text-stone-600">
                      Content
                    </p>
                    <a
                      onClick={() => navigate(`/NoteView/${item._id}`)}
                      className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-emerald-700 transition group-hover:gap-2.5 group-hover:text-emerald-800 cursor-pointer"
                    >
                      View Note <assets.Eye className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-emerald-800">
                No Notes found for this category
              </p>
              <button
                onClick={() => setselectedCategorie("All Notes")}
                className="mt-4 rounded-full bg-stone-200 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition hover:bg-stone-600"
              >
                View All Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllNotes;
