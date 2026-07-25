import React, { useContext, useEffect, useState, } from 'react'
import {useParams} from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const NoteView = () => {
  const {id} = useParams();
  const [noteData, setnoteData] = useState({})
  const {dummyNotes} = useContext(AppContext);
  
  const [isEdit, setisEdit] = useState(false)
    
  const getNote =  () => {
   setnoteData(dummyNotes.find((dummyNote) => dummyNote.id === id))
  }
  useEffect(()=>{
   getNote();
 },[dummyNotes, id])
  
 return (
     
      <section className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className='mx-auto max-w-2xl'>
             <div className='mb-6 sm:mb-8'>
                <h1 className='text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight'>My Note</h1>
                <p className='mt-1 text-sm text-stone-500'>view, edit and delete your note</p>
             </div>
        <div className='rounded-2xl bg-white border border-stone-300 p-6 sm:p-8 shadow-sm'>

        <div className='flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4'>
            {isEdit === false ?( 
             <p className="text-xs text-stone-500">Created On: {noteData.DateofCreation}</p>)
            : (<input type="text" value={noteData.DateofCreation} 
               onChange={(event) => setnoteData((prev) => ({
                 ...prev,
                 DateofCreation: event.target.value
              }))}
              className="rounded-md border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs text-stone-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            )}
            <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 font-semibold'>
            {noteData.category}</span>    
        </div>

            <div className='mt-5'>
             {isEdit ? (
              <input type="text" value={noteData.title} 
               onChange={(event) => setnoteData((prev)=> ({
               ...prev,
               title: event.target.value
               }))}
              className="w-full rounded-lg border-stone-300 bg-stone-50 px-3.5 py-2.5 text-lg font-semibold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 "/>
            ):
            (
              <h2 className='text-xl font-semibold sm:text-2xl text-emerald-900'>Title: {noteData.title}</h2>    
              )}
            </div>

            <div className='mt-4'>
            {isEdit ? (
             <textarea rows={8} value={noteData.content} onChange={(event)=>setnoteData((prev)=>({
              ...prev,
              content: event.target.value
              }))}
              className="w-full resize-none rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 leading-relaxed outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30">
              </textarea>
            ): 
            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-stone-600">Content: {noteData.content}</p>
            }
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
             {isEdit ? (
              <button onClick={()=> setisEdit(false)} className='inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5'>
               Save</button>
              ):(
                  <>
                    <button className='inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5'  
                     onClick={()=> setisEdit(true)}>Edit</button>
                     <button className='inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100'>
                     Delete</button>
                  </>
               )}
            </div>

            
            
            </div>
      </div>
    </section>
  
  )
}

export default NoteView
