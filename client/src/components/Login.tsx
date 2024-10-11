import { Dispatch, SetStateAction, FormEvent, useRef, useState } from "react"
import { Form, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { siteStyles } from "../types/siteStyles"
import { User } from "../types/user"

import { loginUser } from "../api/loginApi"

import globalStyle from "../assets/global.module.css"

type LoginProps = {
    setUser: Dispatch<SetStateAction<User>>, 
    siteStyles: siteStyles
} 

export function Login({ setUser, siteStyles } : LoginProps) {
    const [errorText, setErrorText] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const nav = useNavigate();

    const ERROR_TEXT = 'User with those credentials not found, please check your username or password';

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        loginUser(usernameRef.current!.value, passwordRef.current!.value).then((res) => {
            console.log(res);

            if(res instanceof Response == false){
                setUser(res);
                nav(`/`)
            }            
            else{
                setErrorText(ERROR_TEXT);
            }
        })
    }

    const siteStyledTextBoxes = {
        backgroundColor: siteStyles.note, 
        borderColor: siteStyles.note, 
        color: siteStyles.label
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4} className="d-flex justify-content-center align-items-center">
                <Form.Text style={{ color: siteStyles.label, fontSize: '2rem' }} id="formLogin">Login</Form.Text>

                <Form.Text style={{ color: 'red', fontSize: '1rem' }} id="errors">{errorText}</Form.Text>

                <Form.Group controlId="formUsername" style={{ width:'20%' }}>
                    <Form.Label style={{ color: siteStyles.label }}>Username</Form.Label>
                    <Form.Control style={{ ...siteStyledTextBoxes }} ref={usernameRef} required/>
                </Form.Group>

                <Form.Group controlId="formPassword" style={{ width:'20%' }}>
                    <Form.Label style={{ color: siteStyles.label }}>Password</Form.Label>
                    <Form.Control style={{ ...siteStyledTextBoxes }} ref={passwordRef} required/>
                </Form.Group>

                <Stack direction="horizontal" gap={2} className="d-flex justify-content-center align-items-center">
                    <Link to="/signup">
                        <Button 
                            style={{ background: siteStyles.secondary, borderColor: siteStyles.secondary, color:siteStyles.label }}
                            className={globalStyle.button} 
                            type="submit" >
                            Sign Up
                        </Button>
                    </Link>
                    <Button 
                        style={{ background: siteStyles.primary, borderColor: siteStyles.primary, color:siteStyles.label }}
                        className={globalStyle.button} 
                        type="submit" >
                        Login
                    </Button>
                </Stack>
            </Stack>
        </Form>
    )
}