import { User } from "../types/user";

export const loginUser = async ( username: string, password: string ) => {
    const response = await fetch(`http://localhost:5050/user/login`, {
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
    const response = await fetch(`http://localhost:5050/user/signup`, {
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
        return await response.json();;
    }
}


export const updateUser = async ( user: User ) => {
    const response = await fetch(`http://localhost:5050/user/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    console.log('JSON.stringify(user)');
    console.log(JSON.stringify(user));
    console.log(response);
    console.log(response.json());

    if(!response?.ok) {
        const message = `An error occurred: ${response.status}`;
        console.error(message);
        return response;
    }
    return response;
}