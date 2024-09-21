import { onCreateTags, onUpdateTags, onDeleteTags } from "../helper/tag_util"
import { Form, Row, Col, Stack, Button, Modal } from "react-bootstrap"
import { Dispatch, SetStateAction, useEffect } from "react"
import { siteStyles } from "../interfaces/siteStyles"
import { Link } from "react-router-dom"
import { NoteCard } from "./NoteCard"
import { Tag, Note } from "../App"
import { useState } from "react"
import { useMemo } from "react"

import globalStyle from "../assets/global.module.css"
import ReactSelect from "react-select"

type NoteListProps = {
    availableTags: Tag[],
    notes: Note[],
    setTags: Dispatch<SetStateAction<Tag[]>>,
    siteStyles: siteStyles
}

export function NoteList({ availableTags, notes, setTags, siteStyles } : NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(note.title.toLowerCase())) &&
            (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag._id === tag._id)));
        })
    }, [title, selectedTags, notes]) 

    const siteStyledTextBoxes = {
        backgroundColor: siteStyles.note, 
        borderColor: siteStyles.note, 
        color: siteStyles.label
    };
    
    const siteStyledTags = {
        backgroundColor: siteStyles.background, 
        borderColor: siteStyles.note, 
        color: siteStyles.label,
        borderRadius: "3px"
    };

    return <>
        <Row className="align-items-center mb-4">
            <Col><h1 style={{ color: siteStyles.label }}>Notes</h1></Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to="/new">
                        <Button 
                            className={globalStyle.button}
                            style={{ backgroundColor: siteStyles.primary, borderColor: siteStyles.primary, color: siteStyles.label }}>
                            Create
                        </Button>
                    </Link>
                    <Button 
                        className={globalStyle.button}
                        onClick={() => setModalIsOpen(true)} 
                        style={{ backgroundColor: siteStyles.secondary, borderColor: siteStyles.secondary, color: siteStyles.label }}>
                        Edit Tags
                    </Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className="mb-4" style={{ color: siteStyles.label }}>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            style={{ ...siteStyledTextBoxes }}
                            onChange={e => setTitle(e.target.value)} 
                            value={title} 
                            type="text" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                            styles={{
                                control: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                menu: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                input: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                noOptionsMessage: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                option: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                multiValue: (baseStyles) => ({ ...baseStyles, ...siteStyledTags, }),
                                multiValueLabel: (baseStyles) => ({ ...baseStyles, ...siteStyledTags }),
                                multiValueRemove: (baseStyles) => ({ ...baseStyles, ...siteStyledTags }),
                            }}
                            options={availableTags.map(tag => {
                                return {label: tag.label, value: tag._id}
                            })}
                            value={selectedTags.map(tag => {
                                return {label: tag.label, value: tag._id}    
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, _id: tag.value}
                                }))
                            }}
                            isMulti/>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {filteredNotes.map(note => (
                <Col key={note._id}>
                    <NoteCard id={note._id} title={note.title} tags={note.tags} siteStyles={siteStyles}/>
                </Col>
            ))}
        </Row>
        <EditTagsModal 
            availableTags={availableTags} 
            setTags={setTags} 
            closeModal={() => setModalIsOpen(false)}
            siteStyles={siteStyles}
            show={modalIsOpen}
        />
    </>
}

type EditTagsModalProps = {
    availableTags: Tag[],
    setTags: Dispatch<SetStateAction<Tag[]>>,
    closeModal: () => void
    siteStyles: siteStyles
    show: boolean,
}

function EditTagsModal({ availableTags, setTags, closeModal, siteStyles, show }: EditTagsModalProps) {
    const [tagsToUpdate, setTagsToUpdate] = useState<Tag[]>(availableTags);
    const [tagsToCreate, setTagsToCreate] = useState<string[]>([]);
    const [tagsToDelete, setTagsToDelete] = useState<Tag[]>([]);

    const [changeMade, setChangeMade] = useState<boolean>(false);

    useEffect(() => {
        setTagsToUpdate(availableTags);
    }, [availableTags]);

    const handleSave = () => {
        const currentLabels = tagsToUpdate.map(tag => tag._id);
        const filteredTags = tagsToCreate.filter((tag) => {
            return tag != '' && tag != null && !currentLabels.includes(tag);
        });

        // tags are not saving or being validated correctly or rendering across site upon update 

        if(filteredTags.length > 0){
            console.log(filteredTags);
            const onCreateTagsProps = {
                tagsToCreate: filteredTags,
                setTags
            }
            onCreateTags(onCreateTagsProps);
        }
        setTagsToCreate([]);

        if(changeMade){
            onUpdateTags({tagsToUpdate, setTags});
        }

        if(tagsToDelete.length > 0){
            const ids = tagsToDelete.map((tag) => {
                return tag._id;
            });
            onDeleteTags({ids, setTags});
            setTagsToDelete([]);
        }
        closeModal();
    };

    const handleClose = () => {
        setTagsToUpdate(availableTags);
        setTagsToCreate([]);
        setTagsToDelete([]);
        closeModal();
    };

    return <Modal show={show} onHide={handleClose}>
        <Modal.Header  style={{ background: siteStyles.background, color: siteStyles.label}} closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: siteStyles.background, color: siteStyles.label}} >
            <Form>
                <Stack gap={2}>
                    {tagsToUpdate.map((tag, index) => (
                        <Row key={index}>
                            <Col xs={10}>
                                <Form.Control type="text" value={tag.label} onChange={e => {
                                    const tagsToUpdateClone = [...tagsToUpdate];
                                    tagsToUpdateClone[index].label = e.target.value;
                                    setTagsToUpdate(tagsToUpdateClone);

                                    setChangeMade(true);
                                }}></Form.Control>
                            </Col>
                            <Col xs={2} className="d-flex justify-content-center">
                                <Button 
                                    onClick={() => {
                                        const tagsToUpdateClone = [...tagsToUpdate];
                                        const deletedTag = tagsToUpdateClone.splice(index, 1);

                                        setTagsToDelete((deletedTags) => {
                                            return [...deletedTags, ...deletedTag];
                                        });

                                        setTagsToUpdate(tagsToUpdateClone);
                                    }} 
                                    variant="outline-danger">
                                    &times;
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    {tagsToCreate.map((tag, index) => (
                        <Row key={index}>
                            <Col xs={10}>
                                <Form.Control 
                                    type="text" 
                                    value={tag} 
                                    onChange={e => {
                                        const tagsToCreateClone = [...tagsToCreate];
                                        tagsToCreateClone[index] = e.target.value;
                                        setTagsToCreate(tagsToCreateClone);
                                    }
                                }/>
                            </Col>
                            <Col xs={2} className="d-flex justify-content-center">
                                <Button 
                                    onClick={() => {
                                        const tagsToCreateClone = [...tagsToCreate];
                                        tagsToCreateClone.splice(index, 1);
                                        setTagsToCreate(tagsToCreateClone);
                                    }} 
                                    variant="outline-danger">
                                    &times;
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Row className="d-flex justify-content-between pt-1">
                        <Col xs={6}>
                            <Button 
                                style={{ background: siteStyles.primary, borderColor: siteStyles.primary, color:siteStyles.label }}
                                onClick={() => {
                                    setTagsToCreate((prevTags: string[]) => {
                                        return [...prevTags, '']
                                    })
                                }}>    
                                Add Tags
                            </Button>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end">
                            <Button 
                                style={{ background: siteStyles.primary, borderColor: siteStyles.primary, color:siteStyles.label, marginRight:'8px' }}
                                onClick={() => {handleSave()}}
                                className={globalStyle.button} 
                                type="button" >
                                Save
                            </Button>
                            <Button 
                                style={{ background: siteStyles.secondary, borderColor: siteStyles.secondary, color:siteStyles.label }}
                                onClick={() => {handleClose()}}
                                type="button" 
                                className={globalStyle.button}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}