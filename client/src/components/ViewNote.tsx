import { Row, Col, Badge, Stack, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { siteStyles } from "../interfaces/siteStyles"
import { useNote } from "./NoteLayout"

import globalStyle from '../assets/global.module.css'
import ReactMarkdown from "react-markdown"

type NoteProps = {
    onDeleteNote: (id: string) => void
    siteStyles: siteStyles
}

export function ViewNote({ onDeleteNote, siteStyles }: NoteProps) {
    const note = useNote()

    return <>
        <Row className="align-items-center mb-4">
            <Col>
                <h1 style={{ color: siteStyles.label }}>{note.title}</h1>
                {note.tags.length > 0 && (
                    <Stack gap={1} direction="horizontal" className="flex-wrap">
                        {note.tags.map(tag => (
                            <Badge className="text-truncate" key={tag._id}>{tag.label}</Badge>
                        ))}
                    </Stack>
                )}
            </Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to={`/${note._id}/edit`}>
                        <Button 
                            style={{ backgroundColor: siteStyles.primary, borderColor: siteStyles.primary, color: siteStyles.label }}
                            className={globalStyle.button}>
                            Edit
                        </Button>
                    </Link>
                    <Button 
                        onClick={() => {
                            onDeleteNote(note._id);
                        }}   
                        className={globalStyle.button}
                        variant="outline-danger">
                        Delete
                    </Button>
                    <Link to="/">
                        <Button 
                            style={{ backgroundColor: siteStyles.secondary, borderColor: siteStyles.secondary, color: siteStyles.label }}
                            className={globalStyle.button}>
                            Back
                        </Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown components={{
            ul(props) {
                const {node, ...rest} = props
                return <ul style={{ backgroundColor: siteStyles.note, margin: '0px', color: siteStyles.label }} {...rest} />
            },
            
            p(props) {
                const {node, ...rest} = props
                return <ul style={{ backgroundColor: siteStyles.note, margin: '0px', color: siteStyles.label }} {...rest} />
            }
        }}>
            {note.markdown}
        </ReactMarkdown>
    </>
}