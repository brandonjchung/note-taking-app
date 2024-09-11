import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { Container, Form, Modal, Col, Row, Button, ButtonGroup } from "react-bootstrap"
import { NewNote } from "./models/NewNote"
import { useLocalStorage } from "./helper/useLocalStorage"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./models/NoteList"
import { NoteLayout } from "./models/NoteLayout"
import { Note } from "./models/Note"
import { EditNote } from "./models/EditNote"
import { useState, useEffect } from "react"
import { PhotoshopPicker  } from "react-color"
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
    const [backgroundColor, setBackgroundColor] = useState('#fff');
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        
    type SettingsModalProps = {
        show: boolean,
        backgroundColor: string,
        setBackgroundColor: (id: string) => void,
        setModalIsOpen: (state: boolean) => void
    }

    function SettingsModal( props : SettingsModalProps ) {
        interface colorObj {
            hex: string
        }

        const [currColor, setCurrColor] = useState(props.backgroundColor);
        const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(true);

        const handleAccept = () => {
            props.setBackgroundColor(currColor);
        };
        const handleChange = (color: colorObj) => {
            setCurrColor(color.hex);
        };
        const handleCancel = () => {
            setShowBackgroundColorPicker(false);
        };

        return <Modal size="lg" show={props.show} onHide={() => {props.setModalIsOpen(false)}} centered>
            <Modal.Header style={{ background: currColor }} closeButton>
                {/* <Modal.Title>Edit Tags</Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{ background: currColor }} >
                <Form>
                    {/* i want column of buttons on the left and a panel on the right for info */}
                    <Row>
                        <Col xs={3}>
                            <Row className="justify-content-center">
                                <ButtonGroup vertical>
                                    <div className={styles.button} style={{ background: 'grey' }}>Profile</div>
                                    <div style={{ background: 'grey' }}>Themes</div>
                                    <div style={{ background: 'grey' }}>Layout</div>
                                    <Button>Profile</Button>
                                    <Button>Themes</Button>
                                    <Button>Layout</Button>
                                </ButtonGroup>
                            </Row>
                        </Col>
                        <Col xs={9}>
                            <Row className="justify-content-center">
                                 {showBackgroundColorPicker && (
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    color={currColor}
                                    onAccept={handleAccept}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                            )}
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    }

    return (
        <Container style={{paddingTop:32}}>
            <Container>
                <Row >
                    <Col className="p-0">
                        <Button variant="outline-secondary" className="float-end" onClick={() => setModalIsOpen(true)}>Settings</Button>
                    </Col>
                </Row>
            </Container>
            <SettingsModal show={modalIsOpen} backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} setModalIsOpen={() => setModalIsOpen(false)}/>
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