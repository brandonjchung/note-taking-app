import { Tag } from "./tag"

export type Note = {
    _id: string
} & NoteData

export type NoteData = {
    markdown: string,
    title: string,
    userId: string,
    tags: Tag[]
}

export type RawNote = {
    _id: string
} & RawNoteData

export type RawNoteData = {
    markdown: string,
    title: string,
    userId: string,
    tagIds: string[]
}