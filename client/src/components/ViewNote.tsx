import { Row, Col, Badge, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"
import ReactMarkdown from "react-markdown"

import { onDeleteNote } from "../helper/note_util"

import { useUser } from "./UserContext"
import { useNote } from "./NoteLayout"

import { RawNote } from "../types/notes"

import globalStyle from '../assets/global.module.css'

type NoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>
}

export function ViewNote({ setNotes }: NoteProps) {
    const { user } = useUser();
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
                <h1 style={{ color: user?.stylePreferences?.labelColor }}>{note.title}</h1>
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
                            style={{ backgroundColor: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color: user?.stylePreferences?.labelColor }}
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
                            style={{ backgroundColor: user?.stylePreferences?.secondaryButtonColor, borderColor: user?.stylePreferences?.secondaryButtonColor, color: user?.stylePreferences?.labelColor }}
                            className={globalStyle.button}>
                            Back
                        </Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown components={{
            ul(props) {
                const {node, ...rest} = props;
                return <ul style={{ backgroundColor: user?.stylePreferences?.noteColor, margin: '0px', color: user?.stylePreferences?.labelColor }} {...rest} />
            },
            
            p(props) {
                const {node, ...rest} = props;
                return <ul style={{ backgroundColor: user?.stylePreferences?.noteColor, margin: '0px', color: user?.stylePreferences?.labelColor }} {...rest} />
            }
        }}>
            {note.markdown}
        </ReactMarkdown>
    </>
}