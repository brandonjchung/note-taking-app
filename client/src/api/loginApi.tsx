export const loginUser = async ( username: string, password: string ) => {
    const response = await fetch(`http://localhost:5050/login`, {
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

