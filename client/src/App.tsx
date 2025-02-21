import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Container, Button, Stack } from "react-bootstrap"
import { useState, useEffect, useMemo } from "react"

import { SettingsModal } from "./components/SettingsModal"
import { SocialModal } from "./components/SocialModal"
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

    const [settingsModalIsOpen, setSettingModalIsOpen] = useState(false);
    const [socialModalIsOpen, setSocialModalIsOpen] = useState(false);
    
    const { user, setUser } = useUser();
    const nav = useNavigate();
    
    useEffect(() => {
        document.body.style.backgroundColor = user?.stylePreferences?.backgroundColor;

    }, [user?.stylePreferences?.backgroundColor]);
    
    useEffect(() => {
        // new features
            // improve the markdown
            // add friends 
            // profile settings
            // second layout

        // things to add for this feature and still need to test
            // update all note tag and user api callouts to only run on unload 

        // broken
            // style preferences only save on second click of save
            

        // things updated
            // edit tags button broken 
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
        <div className={styles.mainContainer}>
            <Container className="w-100 h-100">
                {user?.username != '' && (
                    <Stack direction="horizontal" gap={2} className="pt-4 justify-content-end">
                        <Button 
                            style={{ background: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color: user?.stylePreferences?.labelColor }}
                            onClick={() => setSettingModalIsOpen(true)} 
                            className={styles.button} >
                            Settings
                        </Button>
                        {/* <Button 
                            style={{ background: user?.stylePreferences?.secondaryButtonColor, borderColor: user?.stylePreferences?.secondaryButtonColor, color: user?.stylePreferences?.labelColor }}
                            onClick={() => setSocialModalIsOpen(true)} 
                            className={styles.button} >
                            Friends
                        </Button> */}
                    </Stack>
                )}
                <SettingsModal 
                    show={settingsModalIsOpen} 
                    setModalIsOpen={() => setSettingModalIsOpen(false)}
                />
                <SocialModal 
                    show={socialModalIsOpen} 
                    setModalIsOpen={() => setSocialModalIsOpen(false)}
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
        </div>
    )
}

export default App