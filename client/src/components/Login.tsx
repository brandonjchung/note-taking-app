import { Dispatch, SetStateAction, FormEvent, useRef, useState } from "react"
import { Form, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useUser } from "./UserContext"

import { User } from "../types/user"

import { loginUser } from "../api/userApi"

import globalStyle from "../assets/global.module.css"

type LoginProps = {
    setUser: Dispatch<SetStateAction<User>>
} 

export function Login({ setUser } : LoginProps) {
    const [errorText, setErrorText] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { user } = useUser();
    const nav = useNavigate();

    const ERROR_TEXT = 'User with those credentials not found, please check your username or password';

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        loginUser(usernameRef.current!.value, passwordRef.current!.value).then((res) => {
            console.log(res);

            if(res instanceof Response == false){
                setUser((defaultSettings) => {
                    return {...defaultSettings, ...res}
                });
                nav(`/`)
            }            
            else{
                setErrorText(ERROR_TEXT);
            }
        })
    }

    const siteStyledTextBoxes = {
        backgroundColor: user?.stylePreferences?.noteColor, 
        borderColor: user?.stylePreferences?.noteColor, 
        color: user?.stylePreferences?.labelColor
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4} className="d-flex justify-content-center align-items-center">
                <Form.Text style={{ color: user?.stylePreferences?.labelColor, fontSize: '2rem' }} id="formLogin">Login</Form.Text>

                <Form.Text style={{ color: 'red', fontSize: '1rem' }} id="errors">{errorText}</Form.Text>

                <Form.Group controlId="formUsername" style={{ width:'20%' }}>
                    <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Username</Form.Label>
                    <Form.Control style={{ ...siteStyledTextBoxes }} ref={usernameRef} required/>
                </Form.Group>

                <Form.Group controlId="formPassword" style={{ width:'20%' }}>
                    <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Password</Form.Label>
                    <Form.Control style={{ ...siteStyledTextBoxes }} ref={passwordRef} required/>
                </Form.Group>

                <Stack direction="horizontal" gap={2} className="d-flex justify-content-center align-items-center">
                    <Link to="/signup">
                        <Button 
                            style={{ background: user?.stylePreferences?.secondaryButtonColor, borderColor: user?.stylePreferences?.secondaryButtonColor, color:user?.stylePreferences?.labelColor }}
                            className={globalStyle.button} 
                            type="submit" >
                            Sign Up
                        </Button>
                    </Link>
                    <Button 
                        style={{ background: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color:user?.stylePreferences?.labelColor }}
                        className={globalStyle.button} 
                        type="submit" >
                        Login
                    </Button>
                </Stack>
            </Stack>
        </Form>
    )
}