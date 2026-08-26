import React, { useEffect } from 'react'
import { useEditor, EditorContent, isActive } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const RichTextEditor = ({ value, onChange }) => {
 const editor = useEditor({
    extensions: [ StarterKit, Underline,

        Link.configure({
            openOnClick: false
        }),

        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),

        Placeholder.configure({
            placeholder: "Write Your Note Conteent Here"
        })

    ],
    content: value,
    onUpdate: ({editor}) => {
        onChange(editor.getHTML())
    }
 })

 useEffect( ()=> {
    if (!editor) 
        return
    const currentContent = editor.getHTML()
    if (value !== currentContent) {
        editor.commands.setContent(value || "")
    } 
 },[value, editor])

 if (!editor) {
    return null
 }

 const linkHandle = () => {
    const prefixUrl = editor.getAttributes("link").href
    
    const url = window.prompt(
        "Enter url....",
        prefixUrl || "http://"
    )
    
    if (url === null) {
        return
    }
    
    if (url === "") {
        editor.chain().focus().unsetLink().run();
        return
    }
    
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()

 }

 const button = (active) => `flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition ${
    active ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
 }`

 const divider = () => <div className='mx-1 h-5 w-px bg-stone-300'/>
    return (
    <div className='rounded-2xl border border-stone-300 bg-white shadow-sm overflow-hidden'>
        <div className='flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-50 px-3 py-2'>

            {/*For make text Bold*/}
            <button type="button" title='Bold' onClick={() => editor.chain().focus().toggleBold().run() } 
                className={button(editor.isActive('bold'))}>
                <strong>B</strong>
            </button>

            {/*For make text Italic*/}
            <button type="button" title='Italic' onClick={() => editor.chain().focus().toggleItalic().run() }
              className={button(editor.isActive('italic'))} >
                <em>I</em>
            </button>

            {/*For make text Underline*/}
            <button type="button" title='Underline' onClick={() => editor.chain().focus().toggleUnderline().run() }
               className={button(editor.isActive('underline'))} >
                <u>U</u>
            </button>
                        <divider/>
           
            {/*For make text as Heading 1*/}
            <button type="button" title='Heading 1' onClick={() => editor.chain().focus().toggleHeading({level:1}).run() }
            className={button(editor.isActive('heading', {level: 1}))} >
                H1
            </button>

            {/*For make text as Heading 2*/}
            <button type="button" title='Heading 2' onClick={() => editor.chain().focus().toggleHeading({level:2}).run() }
              className={button(editor.isActive('heading', {level: 2}))} >
                H2
            </button>
                        <divider/>

            {/*For make text Toggle BulletList*/}
            <button type="button" title='Bullet List' onClick={() => editor.chain().focus().toggleBulletList().run() } 
                className={button(editor.isActive('bulletList'))}>
                .
            </button>

            {/*For make text Toggle NumberList*/}
            <button type="button" title='Number List' onClick={() => editor.chain().focus().toggleOrderedList().run() } 
                className={button(editor.isActive('orderedList'))}>
                1.
            </button>
            
                        <divider/>

            {/*For make text Toggle Align Left*/}
            <button type="button" title='Align Left' onClick={() => editor.chain().focus().toggleTextAlign("left").run() } 
                className={button(editor.isActive({textAlign: 'left'}))}>
                ≡
            </button>

            {/*For make text Toggle Align Centre*/}
            <button type="button" title='Align Center' onClick={() => editor.chain().focus().toggleTextAlign("center").run() } 
                className={button(editor.isActive({textAlign: 'center'}))}>
                ≡
            </button>

            {/*For make text Toggle Align Right*/}
            <button type="button" title='Align Right' onClick={() => editor.chain().focus().toggleTextAlign("right").run() } 
                className={button(editor.isActive({textAlign: 'right'}))}>
                ≡
            </button>

                <divider/>
                {/*For Links*/}
                <button type="button" title='Add Link' onClick={linkHandle} className={button(editor.isActive('link'))}>
                    🔗
                </button>

                {/*For Removing Link*/}
                <button type="button" title='Remove Link' onClick={() => editor.chain().focus().unsetLink().run()} 
                    className={button(false)}>
                    🔗/
                </button>

                <divider/>
                {/*For Undo the Content*/}
                <button type="button" title='Undo' onClick={() => editor.chain().focus().undo().run()} className={button(false)} >
                    ↶
                </button>

                {/*For Redo the Content*/}
                <button type="button" title='Undo' onClick={() => editor.chain().focus().redo().run()} className={button(false)}>
                    ↷
                </button>


            
        </div>
        <EditorContent editor={editor} className='min-h-[200px] px-4 py-3 text-sm leading-relaxed text-stone-800
          [&_.ProseMirror]:outline-none
          [&_.is-editor-empty::before]:pointer-events-none [&_.is-editor-empty::before]:float-left [&_.is-editor-empty::before]:h-0 [&_.is-editor-empty::before]:text-stone-400 [&_.is-editor-empty::before]:content-[attr(data-placeholder)]
          [&_h1]:mt-2 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-emerald-900
          [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-emerald-900
          [&_p]:my-2
          [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5
          [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5
          [&_a]:text-emerald-700 [&_a]:underline [&_a]:decoration-emerald-300
          [&_strong]:font-semibold'/>
    </div>
  )
}

export default RichTextEditor
