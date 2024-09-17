import { Form, Row, Col, Stack, Button, Modal } from "react-bootstrap"
import { siteStyles } from "../interfaces/siteStyles"
import { Link } from "react-router-dom"
import { NoteCard } from "./NoteCard"
import { Tag, Note } from "../App"
import { useState } from "react"
import { useMemo } from "react"

import globalStyle from "../assets/global.module.css"
import ReactSelect from "react-select"

type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (data: Tag) => void
    siteStyles: siteStyles
}

export function NoteList({ availableTags, notes, onDeleteTag, onUpdateTag, siteStyles } : NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(note.title.toLowerCase())) &&
            (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag._id === tag._id)))
        })
    }, [title, selectedTags, notes]) 

    const siteStyledTextBoxes = {
        backgroundColor: siteStyles.note, 
        borderColor: siteStyles.note, 
        color: siteStyles.label
    }

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
                                control: (baseStyles) => ({
                                ...baseStyles,
                                ...siteStyledTextBoxes
                                }),
                                menu: (baseStyles) => ({
                                ...baseStyles,
                                ...siteStyledTextBoxes
                                }),
                                input: (baseStyles) => ({
                                ...baseStyles,
                                ...siteStyledTextBoxes
                                }),
                                noOptionsMessage: (baseStyles) => ({
                                ...baseStyles,
                                ...siteStyledTextBoxes
                                }),
                                option: (baseStyles) => ({
                                ...baseStyles,
                                ...siteStyledTextBoxes
                                }),
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
            show={modalIsOpen}
            onDeleteTag={onDeleteTag} 
            onUpdateTag={onUpdateTag}
            handleClose={() => setModalIsOpen(false)}
            siteStyles={siteStyles}
        />
    </>
}

type EditTagsModalProps = {
    availableTags: Tag[],
    show: boolean,
    onDeleteTag: (id: string) => void
    onUpdateTag: (data: Tag) => void
    handleClose: () => void
    siteStyles: siteStyles
}

function EditTagsModal({ availableTags, show, onDeleteTag, onUpdateTag, handleClose, siteStyles }: EditTagsModalProps) {
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header  style={{ background: siteStyles.background, color: siteStyles.label}} closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: siteStyles.background, color: siteStyles.label}} >
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag._id}>
                            <Col class="col-6">
                                <Form.Control type="text" value={tag.label} onChange={e => onUpdateTag({_id: tag._id, label: e.target.value})}></Form.Control>
                            </Col>
                            <Col>
                                <Button onClick={() => onDeleteTag(tag._id)} variant="outline-danger">&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}