import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { Container, Button, Stack } from "react-bootstrap"
import { NewNote } from "./components/NewNote"
import { useLocalStorage } from "./helper/useLocalStorage"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./components/NoteList"
import { NoteLayout } from "./components/NoteLayout"
import { Note } from "./components/Note"
import { EditNote } from "./components/EditNote"
import { useState, useEffect } from "react"
import { SettingsModal } from "./components/SettingsModal"
import styles from './App.module.css'

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
    const [backgroundColor, setBackgroundColor] = useLocalStorage<string>("BACKGROUND_COLOR", '#ffffff')
    const [primaryButtonColor, setPrimaryButtonColor] = useLocalStorage<string>("PRIMARY_COLOR", '#1A00FF')
    const [secondaryButtonColor, setSecondaryButtonColor] = useLocalStorage<string>("SECONDARY_COLOR", '#B3B3B3')
    const [labelColor, setLabelColor] = useLocalStorage<string>("LABEL_COLOR", '##000000')
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const siteStyles = {
        background: backgroundColor,
        primary: primaryButtonColor,
        secondary: secondaryButtonColor,
        label: labelColor,
    }

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;
    }, [backgroundColor]);

    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
        })
    }, [notes, tags])

    function onCreateNote( { tags, ...data }: NoteData ) {
        setNotes(prevNotes => {
            return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
        })
    }

    function onEditNote( id: string, { tags, ...data }: NoteData ) {
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
    
    function onDeleteNote( id: string ) {
        setNotes(prevNotes => {
            return prevNotes.filter(note => note.id != id)
        })
    }

    function onAddTag( data : Tag ){
        setTags(prevTags => {
            return [...prevTags, data]
        })
    }

    function onUpdateTag( data : Tag ){
        setTags(prevTags => {
            return prevTags.map(tag => {
                if(tag.id == data.id){
                    return data
                }
                return tag;
            })
        })
    }

    function onDeleteTag( id : string ){
        setTags(prevTags => {
            return prevTags.filter(tag => tag.id != id)
        })
    }

    return (
        <Container className={styles.mainContainer}>
            <Stack direction="horizontal" className="justify-content-end">
                <Button 
                    style={{ background: primaryButtonColor, borderColor: primaryButtonColor, color: labelColor }}
                    onClick={() => setModalIsOpen(true)} 
                    className={styles.button} >
                    Settings
                </Button>
            </Stack>
            <SettingsModal 
                show={modalIsOpen} 
                siteStyles={siteStyles}
                setBackgroundColor={setBackgroundColor} 
                setPrimaryButtonColor={setPrimaryButtonColor}
                setSecondaryButtonColor={setSecondaryButtonColor}
                setLabelColor={setLabelColor}
                setModalIsOpen={() => setModalIsOpen(false)}
            />
            <Routes>
                <Route path="/" element={<NoteList onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} availableTags={tags} notes={notesWithTags} siteStyles={siteStyles}/>}/>
                <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag} availableTags={tags} siteStyles={siteStyles}/>}/>
                <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
                    <Route index element={<Note siteStyles={siteStyles} onDeleteNote={onDeleteNote}/>}/>
                    <Route path="edit" element={<EditNote onSubmit={onEditNote} onAddTag={onAddTag} availableTags={tags} siteStyles={siteStyles}/>}/>
                </Route>
                <Route path="/*" element={<Navigate to="/" />}/>
            </Routes>

        </Container>
    )
}

export default App