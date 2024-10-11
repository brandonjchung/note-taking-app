import { Tag } from "./tag"

export type Note = {
    _id: string
} & NoteData

export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

export type RawNote = {
    _id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}