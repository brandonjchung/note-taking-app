import { siteStyles } from "../interfaces/siteStyles"
import { NoteData, Tag } from "../App"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (data: Tag) => void
    availableTags: Tag[]
    siteStyles: siteStyles
}

export function NewNote({ onSubmit, onAddTag, availableTags, siteStyles } : NewNoteProps){
    return (
        <>
            <h1 className="mb-4" style={{ color: siteStyles.label }}>new note</h1>
            <NoteForm 
                onSubmit={onSubmit} 
                onAddTag={onAddTag} 
                availableTags={availableTags}
                siteStyles={siteStyles}
                />
        </>
    )
}   
