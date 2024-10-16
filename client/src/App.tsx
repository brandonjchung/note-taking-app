import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Container, Button, Stack } from "react-bootstrap"
import { useState, useEffect, useMemo } from "react"

import { SettingsModal } from "./components/SettingsModal"
import { NoteLayout } from "./components/NoteLayout"
import { useUser } from "./components/UserContext"
import { EditNote } from "./components/EditNote"
import { NoteList } from "./components/NoteList"
import { ViewNote } from "./components/ViewNote"
import { NewNote } from "./components/NewNote"
import { Signup } from "./components/Signup"
import { Login } from "./components/Login"

import { getNotes } from "./api/notesApi"
import { getTags } from "./api/tagsApi"

import { RawNote } from "./types/notes"
import { Tag } from "./types/tag"

import "bootstrap/dist/css/bootstrap.min.css"
import styles from './App.module.css'

function App() {
    const [notes, setNotes] = useState<RawNote[]>([]);
    const [tags, setTags] = useState<Tag[]>([]); 

    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const { user, setUser } = useUser();
    const nav = useNavigate();
    
    useEffect(() => {
        document.body.style.backgroundColor = user?.stylePreferences?.backgroundColor;

    }, [user?.stylePreferences?.backgroundColor]);
    
    useEffect(() => {
        // new features
            // improve the markdown
            // add friends 

        // things to add for this feature and still need to test
            // update all note tag and user api callouts to only run on unload 

        // things updated
            // style preferences load by user and update somehow LOL
            // remove the colors from everywhere use the usercontext to directly access the settings
            // reattach notes and tags to lookup logged in user
            // only query notes and tags by logged in user
        if(user?._id == '' || user?._id == null){
            nav(`/login`);
            return;
        }
        else{
            getNotes(user?._id).then((noteData) => {
                if(noteData){
                    setNotes(noteData);
                }
            });
            getTags(user?._id).then((tagData) => {
                if(tagData){
                    setTags(tagData);
                }
            });
        }

    }, [user?.username]);

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
                        style={{ background: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color: user?.stylePreferences?.labelColor }}
                        onClick={() => setModalIsOpen(true)} 
                        className={styles.button} >
                        Settings
                    </Button>
                </Stack>
            )}
            <SettingsModal 
                show={modalIsOpen} 
                setModalIsOpen={() => setModalIsOpen(false)}
            />
            <Routes>
                <Route path="/" element={<NoteList setTags={setTags} availableTags={tags} notes={notesWithTags}/>}/>
                <Route path="/login" element={<Login setUser={setUser}/>}/>
                <Route path="/signup" element={<Signup setUser={setUser}/>}/>
                <Route path="/new" element={<NewNote setNotes={setNotes} setTags={setTags} availableTags={tags}/>}/>
                <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
                    <Route index element={<ViewNote setNotes={setNotes}/>}/>
                    <Route path="edit" element={<EditNote setNotes={setNotes} setTags={setTags} availableTags={tags}/>}/>
                </Route>
                <Route path="/*" element={<Navigate to="/" />}/>
            </Routes>

        </Container>
    )
}

export default App