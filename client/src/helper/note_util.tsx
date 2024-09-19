import { createNote, getNotes, updateNote, deleteNote } from "../api/notesApi"
import { NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction } from "react"
import { RawNote, NoteData } from "../App";

type onCreateNoteProps = {
    noteDataProps: NoteData, 
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    nav: NavigateFunction
}

export function onCreateNote( { noteDataProps: { tags, ...data }, setNotes, nav }: onCreateNoteProps ) {
    createNote({...data, tagIds: tags.map(tag => tag._id)}).then((res: string) => {
        if(res != null){
            getNotes().then((noteData: RawNote[]) => {
                if(noteData){
                    setNotes(noteData);
                    nav(`/${res}`);
                }
            });
        }
    });

    // local storage
    // setNotes(prevNotes => {
    //     return [...prevNotes, {...data, _id: uuidV4(), tagIds: tags.map(tag => tag._id)}]
    // });
};

type onEditNoteProps = {
    noteDataProps: NoteData, 
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    nav: (to: string) => void,
    id: string, 
}

export function onEditNote( { noteDataProps: { tags, ...data }, setNotes, nav, id }: onEditNoteProps ) {

    updateNote({ _id: id, ...data, tagIds: tags.map(tag => tag._id)}).then((res: string | null) => {
        if(res){
            setNotes(prevNotes => {
                return prevNotes.map(note => {
                    if(note._id === id){
                        return {...note, ...data, tagIds: tags.map(tag => tag._id)}
                    }
                    else {
                        return note;
                    }
                });
            });
            nav(`/${res}`);
        }
    });
};

type onDeleteNoteProps = {
    setNotes: Dispatch<SetStateAction<RawNote[]>>, 
    nav: (to: string) => void,
    id: string, 
}

export function onDeleteNote( { setNotes, nav, id }: onDeleteNoteProps ) {
    deleteNote(id).then((res: true | null) => {
        if(res != null){
            setNotes(prevNotes => {
                return prevNotes.filter(note => note._id != id);
            })
            nav(`..`);
        }
    });
}