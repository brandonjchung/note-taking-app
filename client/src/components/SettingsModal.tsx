import { Button, ButtonGroup, Col, Form, Modal, Row, Image, Stack  } from "react-bootstrap"
import { useState, useRef } from "react";
import { PhotoshopPicker  } from "react-color" 

import { useUser } from "./UserContext"
import { updateUserStyle, updateUserProfileWithPassword, updateUserProfileWithoutPassword } from "../api/userApi";

import { GENERIC_ERROR_TEXT } from "../assets/globalStrings";
import TileIconLight from '../assets/TileIconLight.png'
import TileIconDark from '../assets/TileIconDark.png'
import NoteIconLight from '../assets/NoteIconLight.png'
import NoteIconDark from '../assets/NoteIconDark.png'
import styles from './SettingsModal.module.css'

type SettingsModalProps = {
    show: boolean,
    setModalIsOpen: (state: boolean) => void
}

export function SettingsModal( props : SettingsModalProps ) {
    interface colorObj {
        hex: string
    };

    const { user, setUser } = useUser();
    
    const settings = ['Profile', 'Themes', 'Social', 'Layout'];
    const themeSubSettings = ['Background Color', 'Note Color', 'Primary Button Color', 'Secondary Button Color', 'Label'];
    const socialSubSettings = ['Add Friends', 'Your Contacts'];

    const [currSetting, setCurrSetting] = useState(settings[0]);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errorText, setErrorText] = useState('');
    
    const [currColor, setCurrColor] = useState(user?.stylePreferences?.backgroundColor);
    const [currThemeSubSetting, setCurrThemeSubSetting] = useState(themeSubSettings[0]);
    const [colorPicker, setColorPicker] = useState(true);
    const [selected, setSelected] = useState(false);
    
    const [currSocialSubSetting, setCurrSocialSubSetting] = useState(socialSubSettings[0]);

    const isDark = () => {
        const backgroundColor = user.stylePreferences.backgroundColor.replace(/^#/, '');

        const bigint = parseInt(backgroundColor, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        return brightness < 128;
    }

    const resetModalValues = () => {
        setErrorText('');
        handleProfileReset();
        handleThemesReset();
        props.setModalIsOpen(false);
    }

    const handleProfileReset = () => {
        setIsEditPassword(false);
        setIsDisabled(true);
    }

    const handleProfileSave = () => {

        if(isEditPassword){
            const updatedUser = { 
                ...user, 
                username: usernameRef.current!.value, 
                password: passwordRef.current!.value, 
                firstName: firstNameRef.current!.value, 
                lastName: lastNameRef.current!.value
            }
            updateUserProfileWithPassword(updatedUser).then((res) => {
                if(res.status == 200){
                    setUser(updatedUser);
                }  
                else{
                    setErrorText(GENERIC_ERROR_TEXT);
                }     
            })
        }
        else{
            const updatedUser = { 
                ...user, 
                username: usernameRef.current!.value, 
                firstName: firstNameRef.current!.value, 
                lastName: lastNameRef.current!.value
            }

            updateUserProfileWithoutPassword(updatedUser).then((res) => {
                console.log(res);
                if(res.status == 200){
                    setUser(updatedUser);
                }       
                else{
                    setErrorText(GENERIC_ERROR_TEXT);
                }    
            })
            
        }
    }

    const handleThemesAccept = ( currThemeSubSetting: string ) => {
        const stylePreferences = {...user?.stylePreferences};

        switch(currThemeSubSetting){
            case 'Background Color':
                stylePreferences.backgroundColor = currColor;
                break;
            case 'Note Color':
                stylePreferences.noteColor = currColor;
                break;
            case 'Primary Button Color':
                stylePreferences.primaryButtonColor = currColor;
                break;
            case 'Secondary Button Color':
                stylePreferences.secondaryButtonColor = currColor;
                break;
            case 'Label':
                stylePreferences.labelColor = currColor;
                break;
        }
        
        // setUser((prevSettings) => {
        //     return {...prevSettings, stylePreferences: stylePreferences}
        // });

        // 
        // REFACTOR: Bulkify updates
        
        const updatedUser = { 
            ...user, 
            stylePreferences: stylePreferences
        }

        updateUserStyle(updatedUser).then((res) => {
            console.log(res);
            if(res.status == 200){
                setUser(updatedUser);
            }     
            else{
                setErrorText(GENERIC_ERROR_TEXT);
            }    
        });
    };

    const handleThemesChange = (color: colorObj) => {
        setCurrColor(color.hex);
    };

    const handleThemesCancel = () => {
        switch(currThemeSubSetting){
            case 'Background Color':
                return setCurrColor(user?.stylePreferences?.backgroundColor);
            case 'Note Color':
                return setCurrColor(user?.stylePreferences?.noteColor);
            case 'Primary Button Color':
                return setCurrColor(user?.stylePreferences?.primaryButtonColor);
            case 'Secondary Button Color':
                return setCurrColor(user?.stylePreferences?.secondaryButtonColor);
            case 'Label':
                return setCurrColor(user?.stylePreferences?.labelColor);
        }
    };

    const handleThemesReset = () => {
        setSelected(false);
    }

    const handleThemesSubtheme = ( currThemeSubSetting: string ) => {
        setCurrThemeSubSetting(currThemeSubSetting);
        setColorPicker(!colorPicker);
        switch(currThemeSubSetting){
            case 'Background Color':
                return setCurrColor(user?.stylePreferences?.backgroundColor);
            case 'Note Color':
                return setCurrColor(user?.stylePreferences?.noteColor);
            case 'Primary Button Color':
                return setCurrColor(user?.stylePreferences?.primaryButtonColor);
            case 'Secondary Button Color':
                return setCurrColor(user?.stylePreferences?.secondaryButtonColor);
            case 'Label':
                return setCurrColor(user?.stylePreferences?.labelColor);
        }
    };

    const primaryStyleProps = {
        background: user?.stylePreferences?.primaryButtonColor, 
        borderColor: user?.stylePreferences?.primaryButtonColor, 
        color:user?.stylePreferences?.labelColor,
    };
    
    const secondaryStyleProps = {
        background: user?.stylePreferences?.secondaryButtonColor, 
        borderColor: user?.stylePreferences?.secondaryButtonColor, 
        color:user?.stylePreferences?.labelColor,
    };

    return <Modal size="xl" show={props.show} onHide={resetModalValues} centered>
        <Modal.Header style={{ background: user?.stylePreferences?.backgroundColor }} closeButton></Modal.Header>
        <Modal.Body style={{ background: user?.stylePreferences?.backgroundColor, color: user?.stylePreferences?.labelColor, height: window.innerHeight*.6 }} >
            <Row style={{ height: '100%' }}>
                <Col xs={3}>
                    <Row className="justify-content-center">
                        <ButtonGroup vertical>
                            {settings.map((setting) => {
                                return <Button 
                                    style={{ ...primaryStyleProps }}
                                    onClick={() => {setCurrSetting(setting)}} 
                                    className={styles.modalButton}>
                                    {setting}
                                </Button>
                            })}
                        </ButtonGroup>
                    </Row>
                </Col>
                <Col xs={9} style={{ height: '100%' }}>
                    {currSetting=='Profile' && (
                        <Col style={{ height: '100%' }}>
                            <Row style={{ height: '8%' }}>
                                <Col>Profile Info</Col>
                                {isDisabled && (
                                    <Col className="d-flex justify-content-end"><Button onClick={() => setIsDisabled(!isDisabled)}>Edit Info</Button></Col>
                                )}
                            </Row>
                            <Row style={{ height: '84%' }}>
                                <Form  className="d-flex justify-content-center">
                                    <Stack gap={3}>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId="firstName">
                                                    <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>First Name</Form.Label>
                                                    <Form.Control defaultValue={user?.firstName} ref={firstNameRef} disabled={isDisabled} required/>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId="lastName">
                                                    <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Last Name</Form.Label>
                                                    <Form.Control defaultValue={user?.lastName} ref={lastNameRef} disabled={isDisabled} required/>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId="formUsername">
                                                    <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Username</Form.Label>
                                                    <Form.Control defaultValue={user?.username} ref={usernameRef} disabled={isDisabled} required/>
                                                </Form.Group>
                                            </Col>
                                            {!isEditPassword && (
                                                <Col className="d-flex align-items-end justify-content-center">
                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label style={{ color: user?.stylePreferences?.labelColor }}></Form.Label>
                                                        <Button disabled={isDisabled} onClick={() => setIsEditPassword(!isEditPassword)}>Change Password</Button>
                                                    </Form.Group>
                                                </Col>
                                            )}
                                            {isEditPassword && (
                                                <Col>
                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Change Password</Form.Label>
                                                        <Form.Control ref={passwordRef} required/>
                                                    </Form.Group>
                                                </Col>
                                            )}
                                        </Row>
                                        {isEditPassword && (
                                            <Row>
                                                <Col>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label style={{ color: user?.stylePreferences?.labelColor }}>Confirm Password</Form.Label>
                                                        <Form.Control ref={confirmPasswordRef} required/>
                                                        {errorText && (<Form.Text style={{ color: 'red', fontSize: '1rem' }} id="errors">{errorText}</Form.Text>)}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        )}
                                    </Stack>
                                </Form>
                            </Row>
                            <Row style={{ height: '8%' }}>
                                {!isDisabled && (
                                    <Col className="d-flex justify-content-end">
                                        <Button style={{ marginRight:'8px' }} onClick={handleProfileReset}>Cancel</Button>
                                        <Button onClick={handleProfileSave}>Save</Button>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    )}
                    {currSetting=='Themes' && (
                        <Row className="p-0">
                            <Col xs={3}>
                                {themeSubSettings.map((subSetting) => {
                                    return <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {
                                            handleThemesSubtheme(subSetting);
                                            setSelected(true);
                                        }} 
                                        className={styles.modalButton} >
                                        {subSetting}
                                    </Button></Row>
                                })}
                            </Col>
                            {colorPicker==true && selected && (
                                <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currThemeSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleThemesAccept(currThemeSubSetting)}}
                                        onChange={handleThemesChange}
                                        onCancel={handleThemesCancel}
                                    />
                                </Col>
                            )}
                            {colorPicker==false && selected && (
                                <Col xs={9}>
                                    <PhotoshopPicker 
                                        className={styles.photoshopPicker}
                                        header={currThemeSubSetting}
                                        color={currColor}
                                        onAccept={() => {handleThemesAccept(currThemeSubSetting)}}
                                        onChange={handleThemesChange}
                                        onCancel={handleThemesCancel}
                                    />
                                </Col>
                            )}
                            {/* <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currThemeSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleThemesAccept(currThemeSubSetting)}}
                                    onChange={handleThemesChange}
                                    onCancel={handleThemesCancel}
                                />
                            </Col> */}
                        </Row>
                    )}
                    {currSetting=='Social' && (
                        <Row>
                            <Col xs={3}>
                                {socialSubSettings.map((subSetting) => {
                                    return <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {
                                            setCurrSocialSubSetting(subSetting);
                                            setSelected(true);
                                        }} 
                                        className={styles.modalButton} >
                                        {subSetting}
                                    </Button></Row>
                                })}
                            </Col>
                            {currSocialSubSetting=='Add Friends' && (
                                <Col xs={9}>
                                    <Row>SearchBar</Row>
                                    <Row>Results</Row>
                                </Col>
                            )}
                            {currSocialSubSetting=='Your Contacts' && (
                                <Col xs={9}>
                                    <Row>All Contacts</Row>
                                </Col>
                            )}
                        </Row>
                    )}
                    {currSetting=='Layout' && (
                        <Row xs={1} sm={2}>
                            <Button style={{ backgroundColor: user.stylePreferences.backgroundColor, borderColor: user.stylePreferences.backgroundColor  }}>
                                <Col className={`d-flex flex-column justify-content-center align-items-center ${styles.layoutContainer}`} style={{ borderColor: user.stylePreferences?.labelColor }}>
                                    <Row className="pt-4" style={{ color: user.stylePreferences?.labelColor }}>Tiles</Row>
                                    <Row className="p-5"><Image src={isDark() ? TileIconLight : TileIconDark}/></Row>
                                </Col>
                            </Button>
                            <Button style={{ backgroundColor: user.stylePreferences.backgroundColor, borderColor: user.stylePreferences.backgroundColor }}>
                                <Col className={`d-flex flex-column justify-content-center align-items-center ${styles.layoutContainer}`} style={{ borderColor: user.stylePreferences?.labelColor }}>
                                    <Row className="pt-4" style={{ color: user.stylePreferences?.labelColor }}>Rows</Row>
                                    <Row className="p-5"><Image src={isDark() ? NoteIconLight : NoteIconDark}/></Row>
                                </Col>
                            </Button>
                        </Row>
                    )}
                </Col>
            </Row>
        </Modal.Body>
    </Modal>
}