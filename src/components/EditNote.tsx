import { NoteForm } from "./NoteForm"
import { NoteData, Tag } from "../App"
import { useNote } from "./NoteLayout"
import { siteStyles } from "../interfaces/siteStyles"

type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (data: Tag) => void
    availableTags: Tag[]
    siteStyles: siteStyles
}

export function EditNote({ onSubmit, onAddTag, availableTags, siteStyles } : EditNoteProps){
    const note = useNote()
    return (
        <>
            <h1 className="mb-4" style={{ color: siteStyles.label }}>Edit note</h1>
            <NoteForm 
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                onSubmit={data => onSubmit(note.id, data)} 
                onAddTag={onAddTag} 
                siteStyles={siteStyles}
                availableTags={availableTags}
            />
        </>
    )
}   
