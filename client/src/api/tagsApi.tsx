import { Tag, RawTag } from "../types/tag";

export const getTags = async ( userId : string ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/${userId}`);

    if(!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return null;
    }

    const tagData = await response.json();

    return tagData;
}

export const createTag = async ( rawTagData: RawTag ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rawTagData)
    });


    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        const tagData = await response.json();
        return tagData.insertedId;
    }
}


export const createTags = async ( labels : string[], userId : string ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/many`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({labels: labels, userId: userId})
    });

    if(!response.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return null;
    }
    else{
        const tagData = await response.json();
        return tagData.insertedIds;
    }
}

export const updateTag = async ( tag : Tag ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/${tag._id}`, {
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
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/many`, {
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
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/${id}`, {
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
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/tag/many`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ids})
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
