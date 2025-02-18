import { Dispatch, SetStateAction, useState, FormEvent, useRef } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"

import { onCreateNote, onEditNote, onDeleteNote } from "../helper/note_util"
import { onCreateTag } from "../helper/tag_util"

import { NoteData, RawNote } from "../types/notes"
import { Tag } from "../types/tag"

import { useUser } from "./UserContext"

import globalStyle from "../assets/global.module.css"

type NoteFormProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    setTags: Dispatch<SetStateAction<Tag[]>>,
    availableTags: Tag[]
} & Partial<NoteData>

export function NoteForm({ setNotes, setTags, availableTags, title="", markdown = "", tags = [] } : NoteFormProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)

    const { user } = useUser();
    const params = useParams();
    const nav = useNavigate();

    const siteStyledTextBoxes = {
        backgroundColor: user?.stylePreferences?.noteColor, 
        borderColor: user?.stylePreferences?.noteColor, 
        color: user?.stylePreferences?.textColor
    }
    const siteStyledTags = {
        borderColor: user?.stylePreferences?.noteColor, 
        color: user?.stylePreferences?.textColor,
        borderRadius: "3px"
    }
    
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        
        const noteData = {
            noteDataProps: {
                title: titleRef.current!.value,
                markdown: markdownRef.current!.value,
                userId: user._id,
                tags: selectedTags
            },
            nav,
            setNotes
        };

        if(params.id){
            const id = params.id;
            onEditNote({...noteData, id});

        }
        else{
            onCreateNote(noteData);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Title</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={titleRef} defaultValue={title} required/>
                        </Form.Group>
                    </Col>    
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Tags</Form.Label>
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
                                    const userId = user._id;
                                    onCreateTag({label, userId, setTags}).then((tagData: void | Tag[]) => {
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
                                        return { label: tag.label, _id: tag.value, userId: user._id}
                                    }))
                                }}
                                isMulti/>
                        </Form.Group>
                    </Col>    
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="markdown">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Body</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={markdownRef} defaultValue={markdown} as="textarea" rows={15} required/>
                        </Form.Group>
                    </Col>    
                </Row>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button 
                        style={{ background: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color:user?.stylePreferences?.labelColor }}
                        className={globalStyle.button} 
                        type="submit" >
                        Save
                    </Button>
                    { params.id != null && (
                        <Button 
                            onClick={() => {
                                const id = params.id;
                                if(id){
                                    onDeleteNote({setNotes, id, nav});
                                }
                            }}   
                            className={globalStyle.button}
                            variant="outline-danger">
                            Delete
                        </Button>
                    )}
                    <Link to="/">
                        <Button 
                            style={{ background: user?.stylePreferences?.secondaryButtonColor, borderColor: user?.stylePreferences?.secondaryButtonColor, color:user?.stylePreferences?.labelColor }}
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