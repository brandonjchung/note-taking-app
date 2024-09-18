import { createNote, getNotes, updateNote, deleteNote } from "./api/notesApi"
import { createTag, getTags, updateTag, deleteTag } from "./api/tagsApi"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Container, Button, Stack } from "react-bootstrap"
import { SettingsModal } from "./components/SettingsModal"
import { useLocalStorage } from "./helper/useLocalStorage"
import { NoteLayout } from "./components/NoteLayout"
import { EditNote } from "./components/EditNote"
import { NoteList } from "./components/NoteList"
import { ViewNote } from "./components/ViewNote"
import { NewNote } from "./components/NewNote"
import { useState, useEffect } from "react"
import { useMemo } from "react"

import "bootstrap/dist/css/bootstrap.min.css"
import styles from './App.module.css'

export type Note = {
    _id: string

} & NoteData

export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

export type RawNote = {
    _id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}

export type Tag = {
    _id: string
    label: string
}

function App() {
    const [primaryButtonColor, setPrimaryButtonColor] = useLocalStorage<string>("PRIMARY_COLOR", '#1A00FF');
    const [secondaryButtonColor, setSecondaryButtonColor] = useLocalStorage<string>("SECONDARY_COLOR", '#B3B3B3');
    const [backgroundColor, setBackgroundColor] = useLocalStorage<string>("BACKGROUND_COLOR", '#ffffff');
    const [labelColor, setLabelColor] = useLocalStorage<string>("LABEL_COLOR", '##000000');
    const [noteColor, setNote] = useLocalStorage<string>("NOTE_COLOR", '#ffffff');

    // const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
    // const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
    const [notes, setNotes] = useState<RawNote[]>([]);
    const [tags, setTags] = useState<Tag[]>([]); 

    const [modalIsOpen, setModalIsOpen] = useState(false);
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
    }, [backgroundColor, notes.length]);

    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds?.includes(tag._id))}
        })
    }, [notes, tags]);

    function onCreateNote( { tags, ...data }: NoteData ) {
        createNote({...data, tagIds: tags.map(tag => tag._id)}).then((res) => {
            if(res != null){
                getNotes().then((noteData) => {
                    if(noteData){
                        setNotes(noteData);
                        nav(`/${res}`);
                    }
                });
            }
        });

        // local storage
        // setNotes(prevNotes => {
        //     return [...prevNotes, {...data, _id: uuidV4(), tagIds: tags.map(tag => tag._id)}]
        // });
    };

    function onEditNote( id: string, { tags, ...data }: NoteData ) {

        updateNote({ _id: id, ...data, tagIds: tags.map(tag => tag._id)}).then((res) => {
            if(res){
                setNotes(prevNotes => {
                    return prevNotes.map(note => {
                        if(note._id === id){
                            return {...note, ...data, tagIds: tags.map(tag => tag._id)}
                        }
                        else {
                            return note;
                        }
                    });
                });
                nav(`/${res}`);
            }
        });
    };
    
    function onDeleteNote( id: string ) {
        deleteNote(id).then((res) => {
            if(res != null){
                setNotes(prevNotes => {
                    return prevNotes.filter(note => note._id != id);
                })
                nav(`..`);
            }
        });
    }

    // import { createTag, getTags, updateTag, deleteTag } from "./api/tagsApi"
    function onAddTag( label : string ){
        createTag(label).then((res) => {
            if(res != null){
                getTags().then((tagData) => {
                    console.log('queriedTagData');
                    console.log(tagData);
                    if(tagData){
                        setTags(tagData);
                    }
                });
            }
        });

        // setTags(prevTags => {
        //     return [...prevTags, data]
        // })
    }

    function onUpdateTag( data : Tag ){
        updateTag(data).then((res) => {
            if(res){
                setTags(prevTags => {
                    return prevTags.map(tag => {
                        if(tag._id == data._id){
                            return data;
                        }
                        return tag;
                    });
                });
            }
        });
    }

    function onDeleteTag( id : string ){
        deleteTag(id).then((res) => {
            if(res != null){
                setTags(prevTags => {
                    return prevTags.filter(tag => tag._id != id)
                })
            }
        });
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
                setNoteColor={setNote}
                setPrimaryButtonColor={setPrimaryButtonColor}
                setSecondaryButtonColor={setSecondaryButtonColor}
                setLabelColor={setLabelColor}
                setModalIsOpen={() => setModalIsOpen(false)}
            />
            <Routes>
                <Route path="/" element={<NoteList onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} availableTags={tags} notes={notesWithTags} siteStyles={siteStyles}/>}/>
                <Route path="/new" element={<NewNote onSubmit={onCreateNote} onDeleteNote={onDeleteNote} onAddTag={onAddTag} availableTags={tags} siteStyles={siteStyles}/>}/>
                <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
                    <Route index element={<ViewNote siteStyles={siteStyles} onDeleteNote={onDeleteNote}/>}/>
                    <Route path="edit" element={<EditNote onSubmit={onEditNote} onDeleteNote={onDeleteNote} onAddTag={onAddTag} availableTags={tags} siteStyles={siteStyles}/>}/>
                </Route>
                <Route path="/*" element={<Navigate to="/" />}/>
            </Routes>

        </Container>
    )
}

export default App