import { Dispatch, SetStateAction } from "react"

import { RawNote } from "../types/notes"
import { Tag } from "../types/tag"

import { useUser } from "./UserContext"
import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[]
}

export function EditNote({ setNotes, setTags, availableTags, } : EditNoteProps){
    const { user } = useUser();
    const note = useNote()

    return (
        <>
            <h1 className="mb-4" style={{ color: user?.stylePreferences?.labelColor }}>Edit note</h1>
            <NoteForm 
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                setNotes={setNotes} 
                setTags={setTags} 
                availableTags={availableTags}
            />
        </>
    )
}   
