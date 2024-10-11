export const signupUser = async ( username: string, password: string ) => {
    const response = await fetch(`http://localhost:5050/signup`, {
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
        return await response.json();;
    }
}