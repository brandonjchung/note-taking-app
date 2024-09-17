import { Tag } from "../App"
import styles from "./NoteCard.module.css"
import { Card, Stack, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { siteStyles } from "../interfaces/siteStyles"

type NoteCardProps = {
    id: string,
    title: string,
    tags: Tag[]
    siteStyles: siteStyles
}

export function NoteCard({ id, title, tags, siteStyles }: NoteCardProps){

    return <>
        <Card as={Link} to={`/${id}/edit`} className={`h-100 text-reset text-decoration-none ${styles.card}`} style={{ backgroundColor: siteStyles.note }}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5" style={{ color: siteStyles.label }}>{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    </>
}