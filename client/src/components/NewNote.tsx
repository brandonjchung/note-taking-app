import { siteStyles } from "../interfaces/siteStyles"
import { Dispatch, SetStateAction } from "react"
import { RawNote, Tag } from "../App"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[]
    siteStyles: siteStyles
}

export function NewNote({ setNotes, setTags, availableTags, siteStyles } : NewNoteProps){
    return (
        <>
            <h1 className="mb-4" style={{ color: siteStyles.label }}>new note</h1>
            <NoteForm 
                setNotes={setNotes} 
                setTags={setTags}
                availableTags={availableTags}
                siteStyles={siteStyles}
                />
        </>
    )
}   
