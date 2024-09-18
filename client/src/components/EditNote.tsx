import { siteStyles } from "../interfaces/siteStyles"
import { NoteData, Tag } from "../App"
import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onDeleteNote: (id: string) => void
    onAddTag: (data: string) => void
    availableTags: Tag[]
    siteStyles: siteStyles
}

export function EditNote({ onSubmit, onDeleteNote, onAddTag, availableTags, siteStyles } : EditNoteProps){
    const note = useNote()
    return (
        <>
            <h1 className="mb-4" style={{ color: siteStyles.label }}>Edit note</h1>
            <NoteForm 
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                onSubmit={(data) => onSubmit(note._id, data)} 
                onDeleteNote={onDeleteNote} 
                onAddTag={onAddTag} 
                siteStyles={siteStyles}
                availableTags={availableTags}
            />
        </>
    )
}   
