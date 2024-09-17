import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import CreatableReactSelect from "react-select/creatable"
import { Link, useNavigate } from "react-router-dom"
import { FormEvent, useRef } from "react"
import { NoteData, Tag } from "../App"
import { useState } from "react"
import { v4 as uuidV4 } from "uuid"
import { siteStyles } from "../interfaces/siteStyles"
import globalStyle from "../assets/global.module.css"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (data: Tag) => void
    availableTags: Tag[]
    siteStyles: siteStyles
} & Partial<NoteData>

export function NoteForm({ onSubmit, onAddTag, availableTags, siteStyles, title="", markdown = "", tags = [] } : NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()
    
    const siteStyledTextBoxes = {
        backgroundColor: siteStyles.note, 
        borderColor: siteStyles.note, 
        color: siteStyles.label
    }
    
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })

        navigate("..")
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
                                    multiValue: (baseStyles) => ({
                                    ...baseStyles,
                                    ...siteStyledTextBoxes
                                    }),
                                    multiValueLabel: (baseStyles) => ({
                                    ...baseStyles,
                                    ...siteStyledTextBoxes
                                    }),
                                    indicatorSeparator: (baseStyles) => ({
                                    ...baseStyles,
                                    ...siteStyledTextBoxes
                                    }),
                                    option: (baseStyles) => ({
                                    ...baseStyles,
                                    ...siteStyledTextBoxes
                                    }),
                                }}
                                onCreateOption={label => {
                                    const newTag = {id: uuidV4(), label}
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
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
                    <Link to="..">
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