import { Dispatch, SetStateAction } from "react"

import { RawNote } from "../types/notes"
import { Tag } from "../types/tag"

import { useUser } from "./UserContext"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[]
}

export function NewNote({ setNotes, setTags, availableTags } : NewNoteProps){
    const { user } = useUser();

    return (
        <>
            <h1 className="mb-4" style={{ color: user?.stylePreferences?.labelColor }}>new note</h1>
            <NoteForm 
                setNotes={setNotes} 
                setTags={setTags}
                availableTags={availableTags}
            />
        </>
    )
}   
