import { Row, Col, Badge, Stack, Button } from "react-bootstrap"
import { siteStyles } from "../interfaces/siteStyles"
import { Link, useNavigate } from "react-router-dom"
import { onDeleteNote } from "../helper/note_util"
import { Dispatch, SetStateAction } from "react"
import { useNote } from "./NoteLayout"
import { RawNote } from "../App"

import globalStyle from '../assets/global.module.css'
import ReactMarkdown from "react-markdown"

type NoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    siteStyles: siteStyles
}

export function ViewNote({ setNotes, siteStyles }: NoteProps) {
    const nav = useNavigate();
    const note = useNote();
    
    const id = note._id;
    const onDeleteNotesProps = {
        setNotes,
        id, 
        nav
    }

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
                            onDeleteNote(onDeleteNotesProps);
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