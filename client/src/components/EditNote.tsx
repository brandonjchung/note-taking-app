import { siteStyles } from "../interfaces/siteStyles"
import { Dispatch, SetStateAction } from "react"
import { RawNote, Tag } from "../App"
import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[]
    siteStyles: siteStyles
}

export function EditNote({ setNotes, setTags, availableTags, siteStyles } : EditNoteProps){
    const note = useNote()
    return (
        <>
            <h1 className="mb-4" style={{ color: siteStyles.label }}>Edit note</h1>
            <NoteForm 
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                setNotes={setNotes} 
                setTags={setTags} 
                siteStyles={siteStyles}
                availableTags={availableTags}
            />
        </>
    )
}   
