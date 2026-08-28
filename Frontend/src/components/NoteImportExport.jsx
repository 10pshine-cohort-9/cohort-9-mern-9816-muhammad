import React from 'react'
import { useRef } from 'react'
import { assets } from '../assets/assets'
import { showError, showSuccess, showWarning } from '../utils/reactToastify'
const NoteImportExport = ({title, content, onImport}) => {
 const inputFiieRef = useRef(null)

 const exportHandling = () => {
    const note = {
        title: title || "Untitled Note",
        content: content || ""
    }
    try {
        const jsonData = JSON.stringify(note, null, 2)
    
        const blob = new Blob( [jsonData], {type: "application/json"} )
    
        const url =URL.createObjectURL(blob)
    
        const link = document.createElement("a")
    
        link.href = url
    
        link.download = `${title || "untitledNote"}.json`
    
        document.body.appendChild(link)
    
        link.click()
        
        document.body.removeChild(link)
        
        URL.revokeObjectURL(url)

        showSuccess("Note exported successfully")
    } catch (error) {
        showError("Failed to export Note")
    }
    
 }

 const handleImportClick = ()=> {
    inputFiieRef.current?.click();
 }

 const importHandling = (event) => {
    const file = event.target.files[0]
    
    if (!file) {
    showError("Please select a file to import")
    return
}

if (
    file.type !== "application/json" ||
    !file.name.toLowerCase().endsWith(".json")
) {
    showWarning("Please select a json file")
    event.target.value = ""
    return
}
    
    const fileReader = new FileReader()
    
    fileReader.onload = (event) => {
        try {
            const importedNote = JSON.parse(event.target.result)
            
            if (typeof importedNote !== 'object' || importedNote === null ) {
                showError("Invalid note format")
                throw new Error("Invalid note format");
            }
            
            if(typeof importedNote.title !== "string"){
                throw new Error("Invalid Note Title");
            }
            
            if(typeof importedNote.content !== "string"){
                throw new Error("Invalid Note Content");
            }
            
            onImport({
                title: importedNote.title,
                content: importedNote.content
            })
            
            showSuccess("Note imported successfully")
        
        } catch (error) {
            console.error("Import Error", error)
            alert("Invalid note file. Please select a valid exported JSON note.")
        }
    }

    fileReader.readAsText(file)
    event.target.value = ""
 }


  return (
    <div className='flex flex-col gap-2 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between '>
      <span className='text-xs text-stone-500'>Back up a note or bring one in from a file</span>  
      
      <div className='flex gap-2'>
      <button type="button" onClick={handleImportClick} 
      className='inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800' >
        <assets.FileUp className='aria-hidden:true'/>
        Import</button>
      <button type="button" onClick={exportHandling}
      className='inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800'>
        <assets.FileDown className='aria-hidden:true'/>
        Export</button>
      <input type="file" ref={inputFiieRef} accept='.json,application/json' onChange={importHandling} 
      className='hidden' />
      </div>
    </div>
  )
}

export default NoteImportExport
