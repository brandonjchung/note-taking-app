import { RawNote, RawNoteData } from "../App";

export const createNote = async ( note : RawNoteData ) => {
    const response = await fetch(`http://localhost:5050/note/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });

    const noteData = await response.json();

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        return noteData.insertedId;
    }
}

export const getNotes = async () => {
    const response = await fetch(`http://localhost:5050/note/`);

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }

    const noteData = await response.json();

    return noteData;
}

export const updateNote = async ( note : RawNote ) => {
    const response = await fetch(`http://localhost:5050/note/${note._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });
    console.log(response);

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        const urlStrings = response.url.split('/');
        return urlStrings[urlStrings.length-1];
    }
}

export const deleteNote = async ( id: string ) => {
    const response = await fetch(`http://localhost:5050/note/${id}`, {
        method: "DELETE",
    });

    console.log(response);
    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }
    else {
        return true;
    }
}
