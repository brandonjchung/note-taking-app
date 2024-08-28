import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export type Note = {
    id: string

} & NoteData

export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

export type RawNote = {
    id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}

export type Tag = {
    id: string
    label: string
}

function App() {
    const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
    const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
        })
    }, [notes, tags])

    function onCreateNote({ tags, ...data}: NoteData) {
        setNotes(prevNotes => {
            return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
        })
    }

    function onEditNote(id: string, { tags, ...data}: NoteData) {
        setNotes(prevNotes => {
            return prevNotes.map(note => {
                if(note.id === id){
                    return {...note, ...data, tagIds: tags.map(tag => tag.id)}
                }
                else {
                    return note;
                }
            })
        })
    }
    
    function onDeleteNote(id: string) {
        setNotes(prevNotes => {
            return prevNotes.filter(note => note.id != id)
        })
    }

    function onAddTag( data : Tag){
        setTags(prevTags => {
            return [...prevTags, data]
        })
    }

    function onUpdateTag( data : Tag){
        setTags(prevTags => {
            return prevTags.map(tag => {
                if(tag.id == data.id){
                    return data
                }
                return tag;
            })
        })
    }

    function onDeleteTag( id : string){
        setTags(prevTags => {
            return prevTags.filter(tag => tag.id != id)
        })
    }

    return (
        <Container style={{paddingTop:16}}>
            <Routes>
                <Route path="/" element={<NoteList onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} availableTags={tags} notes={notesWithTags}/>}/>
                <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag} availableTags={tags}/>}/>
                <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
                    <Route index element={<Note onDeleteNote={onDeleteNote}/>}/>
                    <Route path="edit" element={<EditNote onSubmit={onEditNote} onAddTag={onAddTag} availableTags={tags}/>}/>
                </Route>
                <Route path="/*" element={<Navigate to="/" />}/>
            </Routes>

        </Container>
    )
}

export default App