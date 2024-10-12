import { Card, Stack, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"

import { useUser } from "./UserContext"

import { Tag } from "../types/tag"

import styles from "./NoteCard.module.css"

type NoteCardProps = {
    id: string,
    title: string,
    tags: Tag[]
}

export function NoteCard({ id, title, tags }: NoteCardProps){
    const { user } = useUser();

    return <>
        <Card as={Link} to={`/${id}/edit`} className={`h-100 text-reset text-decoration-none ${styles.card}`} style={{ backgroundColor: user?.stylePreferences?.noteColor }}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5" style={{ color: user?.stylePreferences?.labelColor }}>{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag._id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    </>
}