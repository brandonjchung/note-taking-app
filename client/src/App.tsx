import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Container, Button, Stack } from "react-bootstrap"
import { useState, useEffect, useMemo } from "react"

// import { useLocalStorage } from "./helper/useLocalStorage"

import { SettingsModal } from "./components/SettingsModal"
import { NoteLayout } from "./components/NoteLayout"
import { EditNote } from "./components/EditNote"
import { NoteList } from "./components/NoteList"
import { ViewNote } from "./components/ViewNote"
import { NewNote } from "./components/NewNote"
import { Signup } from "./components/Signup"
import { Login } from "./components/Login"

import { getNotes } from "./api/notesApi"
import { getTags } from "./api/tagsApi"

import { RawNote } from "./types/notes"
import { User } from "./types/user"
import { Tag } from "./types/tag"

import "bootstrap/dist/css/bootstrap.min.css"
import styles from './App.module.css'


function App() {
    // const [primaryButtonColor, setPrimaryButtonColor] = useLocalStorage<string>("PRIMARY_COLOR", '#1A00FF');
    // const [secondaryButtonColor, setSecondaryButtonColor] = useLocalStorage<string>("SECONDARY_COLOR", '#B3B3B3');
    // const [backgroundColor, setBackgroundColor] = useLocalStorage<string>("BACKGROUND_COLOR", '#ffffff');
    // const [labelColor, setLabelColor] = useLocalStorage<string>("LABEL_COLOR", '##000000');
    // const [noteColor, setNote] = useLocalStorage<string>("NOTE_COLOR", '#ffffff');
    // const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
    // const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
    
    const [primaryButtonColor, setPrimaryButtonColor] = useState<string>('#1A00FF');
    const [secondaryButtonColor, setSecondaryButtonColor] = useState<string>('#B3B3B3');
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [labelColor, setLabelColor] = useState<string>('##000000');
    const [noteColor, setNote] = useState<string>('#ffffff');
    const [notes, setNotes] = useState<RawNote[]>([]);
    const [tags, setTags] = useState<Tag[]>([]); 

    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const [user, setUser] = useState<User>();

    const nav = useNavigate();
    
    const siteStyles = {
        background: backgroundColor,
        note: noteColor,
        primary: primaryButtonColor,
        secondary: secondaryButtonColor,
        label: labelColor,
    };

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;

        if(user?.username == '' || user?.username == null){
            nav(`/login`);
            return;
        }

        getNotes().then((noteData) => {
            if(noteData){
                setNotes(noteData);
            }
        });
        getTags().then((tagData) => {
            if(tagData){
                setTags(tagData);
            }
        });
    }, [backgroundColor, notes.length, tags.length, user?.username]);

    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds?.includes(tag._id))}
        })
    }, [notes, tags]);

    return (
        <Container className={styles.mainContainer}>
            {user?.username != '' && (
                <Stack direction="horizontal" className="justify-content-end">
                    <Button 
                        style={{ background: primaryButtonColor, borderColor: primaryButtonColor, color: labelColor }}
                        onClick={() => setModalIsOpen(true)} 
                        className={styles.button} >
                        Settings
                    </Button>
                </Stack>
            )}
            <SettingsModal 
                show={modalIsOpen} 
                siteStyles={siteStyles}
                setBackgroundColor={setBackgroundColor} 
                setNoteColor={setNote}
                setPrimaryButtonColor={setPrimaryButtonColor}
                setSecondaryButtonColor={setSecondaryButtonColor}
                setLabelColor={setLabelColor}
                setModalIsOpen={() => setModalIsOpen(false)}
            />
            <Routes>
                <Route path="/" element={<NoteList setTags={setTags} availableTags={tags} notes={notesWithTags} siteStyles={siteStyles}/>}/>
                <Route path="/login" element={<Login setUser={setUser} siteStyles={siteStyles}/>}/>
                <Route path="/signup" element={<Signup setUser={setUser} siteStyles={siteStyles}/>}/>
                <Route path="/new" element={<NewNote setNotes={setNotes} setTags={setTags} availableTags={tags} siteStyles={siteStyles}/>}/>
                <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
                    <Route index element={<ViewNote siteStyles={siteStyles} setNotes={setNotes}/>}/>
                    <Route path="edit" element={<EditNote setNotes={setNotes} setTags={setTags} availableTags={tags} siteStyles={siteStyles}/>}/>
                </Route>
                <Route path="/*" element={<Navigate to="/" />}/>
            </Routes>

        </Container>
    )
}

export default App