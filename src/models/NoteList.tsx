import { Form, Row, Col, Stack, Button, Modal } from "react-bootstrap"
import ReactSelect from "react-select"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Tag, Note } from "../App"
import { useMemo } from "react"
import { NoteCard } from "./NoteCard"
import { siteStyles } from "../interfaces/siteStyles"
import globalStyle from "../assets/global.module.css"

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
            (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes]) 

    return <>
        <Row className="align-items-center mb-4">
            <Col><h1 style={{ color: siteStyles.label }}>Notes</h1></Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to="/new">
                        <Button 
                            className={globalStyle.button}
                            style={{ backgroundColor: siteStyles.primary, borderColor: siteStyles.primary, color: siteStyles.label}}>
                            Create
                        </Button>
                    </Link>
                    <Button 
                        className={globalStyle.button}
                        onClick={() => setModalIsOpen(true)} 
                        style={{ backgroundColor: siteStyles.secondary, borderColor: siteStyles.secondary, color: siteStyles.label}}>
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
                        <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}></Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                            options={availableTags.map(tag => {
                                return {label: tag.label, value: tag.id}
                            })}
                            value={selectedTags.map(tag => {
                                return {label: tag.label, value: tag.id}    
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, id: tag.value}
                                }))
                            }}
                            isMulti/>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {filteredNotes.map(note => (
                <Col key={note.id}>
                    <NoteCard id={note.id} title={note.title} tags={note.tags}/>
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
                        <Row key={tag.id}>
                            <Col class="col-6">
                                <Form.Control type="text" value={tag.label} onChange={e => onUpdateTag({id: tag.id, label: e.target.value})}></Form.Control>
                            </Col>
                            <Col>
                                <Button onClick={() => onDeleteTag(tag.id)} variant="outline-danger">&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}