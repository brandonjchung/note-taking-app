import { RawNote, RawNoteData } from "../types/notes";

export const createNote = async ( note : RawNoteData ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/note/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });


    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        const noteData = await response.json();
        return noteData.insertedId;
    }
}

export const getNotes = async ( userId: string ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/note/${userId}`);

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }
    else{
        const noteData = await response.json();
    
        return noteData;
    }

}

export const updateNote = async ( note : RawNote ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/note/${note._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });

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
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/note/${id}`, {
        method: "DELETE",
    });

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }
    else {
        return true;
    }
}
