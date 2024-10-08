import { Dispatch, SetStateAction, useState, FormEvent, useRef } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { onCreateNote, onEditNote, onDeleteNote } from "../helper/note_util"
import { NoteData, Tag, RawNote } from "../App"
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { siteStyles } from "../interfaces/siteStyles"
import { onCreateTag } from "../helper/tag_util"

import CreatableReactSelect from "react-select/creatable"
import globalStyle from "../assets/global.module.css"

type NoteFormProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[],
    siteStyles: siteStyles
} & Partial<NoteData>

export function NoteForm({ setNotes, setTags, availableTags, siteStyles, title="", markdown = "", tags = [] } : NoteFormProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)
    const params = useParams();
    const nav = useNavigate();

    const siteStyledTextBoxes = {
        backgroundColor: siteStyles.note, 
        borderColor: siteStyles.note, 
        color: siteStyles.label
    }
    const siteStyledTags = {
        backgroundColor: siteStyles.background, 
        borderColor: siteStyles.note, 
        color: siteStyles.label,
        borderRadius: "3px"
    }
    
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if(params.id){
            const id = params.id;
            const noteData = {
                noteDataProps: {
                    title: titleRef.current!.value,
                    markdown: markdownRef.current!.value,
                    tags: selectedTags
                },
                setNotes, 
                nav,
                id
            };
    
            onEditNote(noteData);

        }
        else{
            const noteData = {
                noteDataProps: {
                    title: titleRef.current!.value,
                    markdown: markdownRef.current!.value,
                    tags: selectedTags
                },
                setNotes, 
                nav
            };
    
            onCreateNote(noteData);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label style={{ color: siteStyles.label }}>Title</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={titleRef} defaultValue={title} required/>
                        </Form.Group>
                    </Col>    
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label style={{ color: siteStyles.label }}>Tags</Form.Label>
                            {/* 
                                CreatableReactSelect options in the form {label, value}
                            */}
                            <CreatableReactSelect 
                                styles={{
                                    control: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                    menu: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                    input: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                    noOptionsMessage: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                    multiValue: (baseStyles) => ({ ...baseStyles, ...siteStyledTags }),
                                    multiValueLabel: (baseStyles) => ({ ...baseStyles, ...siteStyledTags }),
                                    multiValueRemove: (baseStyles) => ({ ...baseStyles, ...siteStyledTags }),
                                    indicatorSeparator: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                    option: (baseStyles) => ({ ...baseStyles, ...siteStyledTextBoxes }),
                                }}
                                onCreateOption={label => {
                                    onCreateTag({label, setTags}).then((tagData: void | Tag[]) => {
                                        if(tagData != null){
                                            setSelectedTags(prevTags => {
                                                const newTag = tagData.find(tag => tag.label == label);
                                                if(newTag != null){
                                                    return [...prevTags, newTag];
                                                }
                                                return [...prevTags];
                                            })
                                        }
                                    })
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
                <Row>
                    <Col>
                        <Form.Group controlId="markdown">
                            <Form.Label style={{ color: siteStyles.label }}>Body</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={markdownRef} defaultValue={markdown} as="textarea" rows={15} required/>
                        </Form.Group>
                    </Col>    
                </Row>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button 
                        style={{ background: siteStyles.primary, borderColor: siteStyles.primary, color:siteStyles.label }}
                        className={globalStyle.button} 
                        type="submit" >
                        Save
                    </Button>
                    { params.id != null && (
                        <Button 
                            onClick={() => {
                                const id = params.id;
                                if(id){
                                    const onDeleteNotesProps = {
                                        setNotes,
                                        id, 
                                        nav
                                    }
                                    onDeleteNote(onDeleteNotesProps);
                                }
                            }}   
                            className={globalStyle.button}
                            variant="outline-danger">
                            Delete
                        </Button>
                    )}
                    <Link to="/">
                        <Button 
                            style={{ background: siteStyles.secondary, borderColor: siteStyles.secondary, color:siteStyles.label }}
                            type="button" 
                            className={globalStyle.button}>
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}