import { Dispatch, SetStateAction, FormEvent, useRef, useState } from "react"
import { Form, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useUser } from "./UserContext"

import { User } from "../types/user"

import { signupUser } from "../api/signupApi"

import globalStyle from "../assets/global.module.css"

type SignupProps = {
    setUser: Dispatch<SetStateAction<User>>
} 

export function Signup({ setUser } : SignupProps) {
    const [errorText, setErrorText] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    
    const { user } = useUser();
    const nav = useNavigate();

    const DUPLICATE_USERNAME_ERROR_TEXT = 'This username is already being used, please select another.';
    const GENERIC_ERROR_TEXT = 'Error, please contact the site admin.';

    
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        signupUser(usernameRef.current!.value, passwordRef.current!.value).then((res) => {

            if(res instanceof Response == false){
                setUser(res);
                nav(`/`)
            }          
            else if(res?.status == 401){
                setErrorText(DUPLICATE_USERNAME_ERROR_TEXT);
            }  
            else if(res?.status == 500){
                setErrorText(GENERIC_ERROR_TEXT);
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
                <Form.Text style={{ color: user?.stylePreferences?.labelColor, fontSize: '2rem' }} id="formSignup">Signup</Form.Text>

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
                    <Link to="/login">
                        <Button 
                            style={{ background: user?.stylePreferences?.secondaryButtonColor, borderColor: user?.stylePreferences?.secondaryButtonColor, color:user?.stylePreferences?.labelColor }}
                            className={globalStyle.button} 
                            type="submit" >
                            Cancel
                        </Button>
                    </Link>
                    <Button 
                        style={{ background: user?.stylePreferences?.primaryButtonColor, borderColor: user?.stylePreferences?.primaryButtonColor, color:user?.stylePreferences?.labelColor }}
                        className={globalStyle.button} 
                        type="submit" >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Form>
    )
}