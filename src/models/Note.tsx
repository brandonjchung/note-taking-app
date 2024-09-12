import { useNote } from "./NoteLayout"
import { Row, Col, Badge, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { siteStyles } from "../interfaces/siteStyles"
import globalStyle from '../assets/global.module.css'

type NoteProps = {
    onDeleteNote: (id: string) => void
    siteStyles: siteStyles
}

export function Note({ onDeleteNote, siteStyles }: NoteProps) {
    const note = useNote()
    const navigate = useNavigate();

    return <>
        <Row className="align-items-center mb-4">
            <Col>
                <h1 style={{ color: siteStyles.label }}>{note.title}</h1>
                {note.tags.length > 0 && (
                    <Stack gap={1} direction="horizontal" className="flex-wrap">
                        {note.tags.map(tag => (
                            <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                        ))}
                    </Stack>
                )}
            </Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to={`/${note.id}/edit`}>
                        <Button 
                            style={{ backgroundColor: siteStyles.primary, borderColor: siteStyles.primary, color: siteStyles.label}}
                            className={globalStyle.button}>
                            Edit
                        </Button>
                    </Link>
                    <Button 
                        onClick={() => {
                            onDeleteNote(note.id);
                            navigate("/")
                        }}   
                        className={globalStyle.button}
                        variant="outline-danger">
                        Delete
                    </Button>
                    <Link to="/">
                        <Button 
                            style={{ backgroundColor: siteStyles.secondary, borderColor: siteStyles.secondary, color: siteStyles.label}}
                            className={globalStyle.button}>
                            Back
                        </Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
}