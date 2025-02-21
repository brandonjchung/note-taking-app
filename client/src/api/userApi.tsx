import { User } from "../types/user";

export const loginUser = async ( username: string, password: string ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    else{
        return await response.json();
    }
}

export const signupUser = async ( user: User ) => {
    console.log(user);
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    else{
        return await response.json();
    }
}

export const updateUserStyle = async ( user: User ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/updateStyle`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    return response;
}

export const updateUserLayout = async ( user: User ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/updateLayout`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    return response;
}

export const updateUserProfileWithPassword = async ( user: User ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/updateProfileWithPassword`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    return response;
}

export const updateUserProfileWithoutPassword = async ( user: User ) => {
    const response = await fetch(`${import.meta.env.VITE_HOST_URL}/user/updateProfileWithoutPassword`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    return response;
}