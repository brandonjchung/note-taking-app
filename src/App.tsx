import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { Container, Form, Modal, Col, Row, Button, ButtonGroup, Stack } from "react-bootstrap"
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
import { siteStyles } from "./interfaces/siteStyles"

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
        
    type SettingsModalProps = {
        show: boolean,
        siteStyles: siteStyles
        setBackgroundColor: (color: string) => void,
        setPrimaryButtonColor: (color: string) => void,
        setSecondaryButtonColor: (color: string) => void,
        setLabelColor: (color: string) => void,
        setModalIsOpen: (state: boolean) => void
    }

    // move this outside when you have a chance
    function SettingsModal( props : SettingsModalProps ) {
        interface colorObj {
            hex: string
        }

        const [currSetting, setCurrSetting] = useState('profile');
        const [currSubSetting, setCurrSubSetting] = useState('Background Color');
        const [currColor, setCurrColor] = useState(props.siteStyles.background);
        const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(true);

        const handleAccept = ( currSubSetting: string ) => {
            
            if(currSubSetting == 'Background Color'){
                props.setBackgroundColor(currColor);
            }
            else if(currSubSetting == 'Primary Button Color'){
                props.setPrimaryButtonColor(currColor);
            }
            else if(currSubSetting == 'Secondary Button Color'){
                props.setSecondaryButtonColor(currColor);
            }
            else if(currSubSetting == 'Label'){
                props.setLabelColor(currColor);
            }
            // try like event stop propogationn or something here
        };
        const handleChange = (color: colorObj) => {
            setCurrColor(color.hex);
        };
        const handleCancel = () => {
            setShowBackgroundColorPicker(false);
        };
        const handleSubtheme = ( currSubSetting: string ) => {
            setCurrSubSetting(currSubSetting);
            if(currSubSetting == 'Background Color'){
                setCurrColor(props.siteStyles.background);
            }
            else if(currSubSetting == 'Primary Button Color'){
                setCurrColor(props.siteStyles.primary);
            }
            else if(currSubSetting == 'Secondary Button Color'){
                setCurrColor(props.siteStyles.secondary);
            }
            else if(currSubSetting == 'Label'){
                setCurrColor(props.siteStyles.label);
            }
        }

        const primaryStyleProps = {
            background: props.siteStyles.primary, 
            borderColor: props.siteStyles.primary, 
            color:props.siteStyles.label,
        }
        const secondaryStyleProps = {
            background: props.siteStyles.secondary, 
            borderColor: props.siteStyles.secondary, 
            color:props.siteStyles.label,
        }

        return <Modal contentClassName={styles.customModal} size="xl" show={props.show} onHide={() => {props.setModalIsOpen(false)}} centered>
            <Modal.Header style={{ background: props.siteStyles.background }} closeButton>
            </Modal.Header>
            <Modal.Body style={{ background: props.siteStyles.background, color: props.siteStyles.label, height: window.innerHeight*.6 }} >
                <Form>
                    <Row>
                        <Col xs={3}>
                            <Row className="justify-content-center">
                                <ButtonGroup vertical>
                                    <Button 
                                        style={{ ...primaryStyleProps }}
                                        onClick={() => {setCurrSetting('profile')}} 
                                        className={styles.modalButton}>
                                        Profile
                                    </Button>
                                    <Button 
                                        style={{ ...primaryStyleProps }}
                                        onClick={() => {setCurrSetting('themes')}} 
                                        className={styles.modalButton} >
                                        Themes
                                    </Button>
                                    <Button 
                                        style={{ ...primaryStyleProps }}
                                        onClick={() => {setCurrSetting('layout')}} 
                                        className={styles.modalButton} >
                                        Layout
                                    </Button>
                                </ButtonGroup>
                            </Row>
                        </Col>
                        <Col xs={9}>
                            <Row className="justify-content-center">
                                {currSetting=='profile' && (
                                    <Col>Profile</Col>
                                )}
                                {currSetting=='themes' && (
                                    <Col xs={3}>
                                        <Row><Button 
                                            style={{ ...secondaryStyleProps }}
                                            onClick={() => {handleSubtheme('Background Color')}} 
                                            className={styles.modalButton} >
                                            Background Color
                                        </Button></Row>
                                        <Row><Button 
                                            style={{ ...secondaryStyleProps }}
                                            onClick={() => {handleSubtheme('Primary Button Color')}} 
                                            className={styles.modalButton} >
                                            Primary Button Color
                                        </Button></Row>
                                        <Row><Button 
                                            style={{ ...secondaryStyleProps }}
                                            onClick={() => {handleSubtheme('Secondary Button Color')}} 
                                            className={styles.modalButton} >
                                            Secondary Button Color
                                        </Button></Row>
                                        <Row><Button 
                                            style={{ ...secondaryStyleProps }}
                                            onClick={() => {handleSubtheme('Label')}} 
                                            className={styles.modalButton} >
                                            Label
                                        </Button></Row>
                                    </Col>
                                    
                                )}
                                {/* Refactor later: can't diagnose why current color doesn't update upon rerender, temporary suboptimal solution */}
                                {/* {currSetting=='themes' && currSubSetting=='Background Color' && showBackgroundColorPicker == true && (
                                    <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleAccept(currSubSetting)}}
                                        onChange={handleChange}
                                        onCancel={handleCancel}
                                    />
                                    </Col>
                                )}  */}
                                {currSetting=='themes' && currSubSetting=='Background Color' && showBackgroundColorPicker == true && (
                                    <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleAccept(currSubSetting)}}
                                        onChange={handleChange}
                                        onCancel={handleCancel}
                                    />
                                    </Col>
                                )} 
                                {currSetting=='themes' && currSubSetting=='Primary Button Color' && showBackgroundColorPicker == true && (
                                    <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleAccept(currSubSetting)}}
                                        onChange={handleChange}
                                        onCancel={handleCancel}
                                    />
                                    </Col>
                                )}
                                {currSetting=='themes' && currSubSetting=='Secondary Button Color' && showBackgroundColorPicker == true && (
                                    <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleAccept(currSubSetting)}}
                                        onChange={handleChange}
                                        onCancel={handleCancel}
                                    />
                                    </Col>
                                )}
                                {currSetting=='themes' && currSubSetting=='Label' && showBackgroundColorPicker == true && (
                                    <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleAccept(currSubSetting)}}
                                        onChange={handleChange}
                                        onCancel={handleCancel}
                                    />
                                    </Col>
                                )}
                                {currSetting=='layout' && (
                                    <Col>Layout</Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
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