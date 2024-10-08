import { Tag } from "../App";

export const getTags = async () => {
    const response = await fetch(`http://localhost:5050/tag/`);

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }

    const tagData = await response.json();

    return tagData;
}

export const createTag = async ( label : string ) => {
    const response = await fetch(`http://localhost:5050/tag/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({label: label})
    });

    const tagData = await response.json();

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        return tagData.insertedId;
    }
}


export const createTags = async ( labels : string[] ) => {
    const response = await fetch(`http://localhost:5050/tag/many`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({labels: labels})
    });

    const tagData = await response.json();

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        return tagData.insertedIds;
    }
}

export const updateTag = async ( tag : Tag ) => {
    const response = await fetch(`http://localhost:5050/tag/${tag._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tag)
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

export const updateTags = async ( tags : Tag[] ) => {
    const response = await fetch(`http://localhost:5050/tag/many`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({tags})
    });

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        return tags;
    }
}

export const deleteTag = async ( id: string ) => {
    const response = await fetch(`http://localhost:5050/tag/${id}`, {
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

export const deleteTags = async ( ids: string[] ) => {
    console.log(ids);
    const response = await fetch(`http://localhost:5050/tag/many`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ids})
    });
    console.log(response);
    console.log(response.json());

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }
    else {
        return true;
    }
}
