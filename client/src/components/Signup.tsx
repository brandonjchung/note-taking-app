import { Dispatch, SetStateAction, FormEvent, useRef, useState } from "react"
import { BsEye, BsEyeFill  } from "react-icons/bs";
import { Form, Stack, Button, Row, Col, InputGroup } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { DUPLICATE_USERNAME_ERROR_TEXT, GENERIC_ERROR_TEXT } from "../assets/globalStrings";

import { useUser } from "./UserContext"

import { User } from "../types/user"

import { signupUser } from "../api/userApi"

import globalStyle from "../assets/global.module.css"

type SignupProps = {
    setUser: Dispatch<SetStateAction<User>>
} 

export function Signup({ setUser } : SignupProps) {
    const [errorText, setErrorText] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    const { user } = useUser();
    const nav = useNavigate();
    
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const newUser = { 
            ...user, 
            username: usernameRef.current!.value, 
            password: passwordRef.current!.value, 
            firstName: firstNameRef.current!.value, 
            lastName: lastNameRef.current!.value
        }

        signupUser(newUser).then((res) => {
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
        color: user?.stylePreferences?.textColor
    }

    return (
        <Form onSubmit={handleSubmit} className="d-flex h-100 ">
            <Stack gap={4} className="d-flex justify-content-center align-items-center">
                <Form.Text style={{ color: user?.stylePreferences?.labelColor, fontSize: '2rem' }} id="formSignup">Signup</Form.Text>

                <Form.Text style={{ color: 'red', fontSize: '1rem' }} id="errors">{errorText}</Form.Text>

                <Row style={{ width:'50%' }}>
                    <Col>
                        <Form.Group controlId="firstName">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>First Name</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={firstNameRef} required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="lastName">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Last Name</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={lastNameRef} required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ width:'50%' }}>
                    <Col>
                        <Form.Group controlId="formUsername">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Username</Form.Label>
                            <Form.Control style={{ ...siteStyledTextBoxes }} ref={usernameRef} required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formPassword">
                            <Form.Label style={{ color: user?.stylePreferences?.labelColor }} >Password</Form.Label>
                            <InputGroup>
                                <Form.Control style={{ ...siteStyledTextBoxes }} ref={passwordRef} type={showPassword ? 'text' : 'password'} required/>
                                <Button variant="outline-secondary" onClick={handleTogglePassword}>
                                    {showPassword && (<BsEye/>)}
                                    {!showPassword && (<BsEyeFill/>)}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Stack direction="horizontal" gap={3} className="pt-5 d-flex justify-content-center align-items-center">
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