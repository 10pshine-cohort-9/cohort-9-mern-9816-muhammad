import React from 'react'

const CreateNote = () => {
  return (
    <div className='mx-auto my-20 w-full max-w-lg px-4 sm:px-0'>
    <div className='rounded-2xl border border-stone-400 bg-white shadow-lg shadow-stone-600/60 p-6 sm:p-8'>
      <h1 className='text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight'>Create A Note:</h1>
      <p className='mt-1 text-sm text-stone-500'>File a new note into your notesbook</p>
    <div>
        <form action="" method='' className='flex flex-col mt-6 gap-5'>
            <div className='flex flex-col gap-1.5'>
            <label htmlFor="category" className='text-xs font-semibold uppercase tracking-wide text-stone-600'>
             Add Category:</label>
            <input type="text" id='category' placeholder='e.g work, personal, idea' required 
             className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"/>
           </div>
           <div className='flex flex-col gap-1.5'>
            <label htmlFor="title" className='text-xs font-semibold uppercase tracking-wide text-stone-600' 
           >Add a title:</label>
            <input type="text" id='title' required placeholder='Give a title to your note'
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"/>
           </div>
         <div className='flex flex-col gap-1.5'>
            <label htmlFor="content" className='text-xs font-semibold uppercase tracking-wide text-stone-600'>
             Add Content:</label>
            <textarea id="content" rows={5} cols={30} placeholder='start typing'
             className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"></textarea>
         </div>
      
          <button type='submit' className="mt-2 inline-flex w-full sm:w-auto sm:self-end items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-1"
         >Save</button>
         
        </form>
      </div>
     </div>
    </div>

//     <div className="mx-auto w-full max-w-lg px-4 sm:px-0">
//   <div className="rounded-2xl border border-stone-200 bg-white shadow-lg shadow-stone-200/60 p-6 sm:p-8">
//     <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
//       Create a note
//     </h1>
//     <p className="mt-1 text-sm text-stone-500">
//       File a new card into your notebook.
//     </p>

//     <form action="" method="" className="mt-6 flex flex-col gap-5">
//       <div className="flex flex-col gap-1.5">
//         <label
//           htmlFor="category"
//           className="text-xs font-semibold uppercase tracking-wide text-stone-600"
//         >
//           Category
//         </label>
//         <input
//           type="text"
//           id="category"
//           required
//           placeholder="e.g. Work, Personal, Ideas"
//           className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
//         />
//       </div>

//       <div className="flex flex-col gap-1.5">
//         <label
//           htmlFor="title"
//           className="text-xs font-semibold uppercase tracking-wide text-stone-600"
//         >
//           Title
//         </label>
//         <input
//           type="text"
//           id="title"
//           required
//           placeholder="Give your note a title"
//           className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
//         />
//       </div>

//       <div className="flex flex-col gap-1.5">
//         <label
//           htmlFor="content"
//           className="text-xs font-semibold uppercase tracking-wide text-stone-600"
//         >
//           Content
//         </label>
//         <textarea
//           id="content"
//           rows={5}
//           placeholder="Start writing..."
//           className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
//         />
//       </div>

//       <button
//         type="submit"
//         className="mt-2 inline-flex w-full sm:w-auto sm:self-end items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5"
//       >
//         Save note
//       </button>
//     </form>
//   </div>
// </div>
  )
}

export default CreateNote
