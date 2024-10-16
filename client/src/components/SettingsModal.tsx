import { Button, ButtonGroup, Col, Form, Modal, Row  } from "react-bootstrap"
import { PhotoshopPicker  } from "react-color" 
import { useState } from "react";

import { useUser } from "./UserContext"
import { updateUser } from "../api/userApi";

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

    const [currSetting, setCurrSetting] = useState('profile');
    const [currSubSetting, setCurrSubSetting] = useState('Background Color');
    const [currColor, setCurrColor] = useState(user?.stylePreferences?.backgroundColor);

    const handleAccept = ( currSubSetting: string ) => {
        const stylePreferences = {...user?.stylePreferences};

        switch(currSubSetting){
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
        
        setUser((prevSettings) => {
            return {...prevSettings, stylePreferences: stylePreferences}
        });

        // 
        // REFACTOR: Bulkify updates
        // 
        updateUser(user);
    };

    const handleChange = (color: colorObj) => {
        setCurrColor(color.hex);
    };

    const handleCancel = () => {
        // setShowBackgroundColorPicker(false);
        switch(currSubSetting){
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

    const handleSubtheme = ( currSubSetting: string ) => {
        setCurrSubSetting(currSubSetting);

        switch(currSubSetting){
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

    return <Modal size="xl" show={props.show} onHide={() => {props.setModalIsOpen(false)}} centered>
        <Modal.Header style={{ background: user?.stylePreferences?.backgroundColor }} closeButton></Modal.Header>
        <Modal.Body style={{ background: user?.stylePreferences?.backgroundColor, color: user?.stylePreferences?.labelColor, height: window.innerHeight*.6 }} >
            <Form>
                <Row>
                    <Col xs={3}>
                        <Row className="justify-content-center">
                            <ButtonGroup vertical>
                                <Button 
                                    style={{ ...primaryStyleProps }}
                                    onClick={() => {setCurrSetting('profile')}} 
                                    className={styles.modalButton}>
                                    Profile
                                </Button>
                                <Button 
                                    style={{ ...primaryStyleProps }}
                                    onClick={() => {setCurrSetting('themes')}} 
                                    className={styles.modalButton} >
                                    Themes
                                </Button>
                                <Button 
                                    style={{ ...primaryStyleProps }}
                                    onClick={() => {setCurrSetting('layout')}} 
                                    className={styles.modalButton} >
                                    Layout
                                </Button>
                            </ButtonGroup>
                        </Row>
                    </Col>
                    <Col xs={9}>
                        <Row className="justify-content-center">
                            {currSetting=='profile' && (
                                <Col>Profile</Col>
                            )}
                            {currSetting=='themes' && (
                                <Col xs={3}>
                                    <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {handleSubtheme('Background Color')}} 
                                        className={styles.modalButton} >
                                        Background Color
                                    </Button></Row>
                                    <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {handleSubtheme('Note Color')}} 
                                        className={styles.modalButton} >
                                        Note Color
                                    </Button></Row>
                                    <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {handleSubtheme('Primary Button Color')}} 
                                        className={styles.modalButton} >
                                        Primary Button Color
                                    </Button></Row>
                                    <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {handleSubtheme('Secondary Button Color')}} 
                                        className={styles.modalButton} >
                                        Secondary Button Color
                                    </Button></Row>
                                    <Row><Button 
                                        style={{ ...secondaryStyleProps }}
                                        onClick={() => {handleSubtheme('Label')}} 
                                        className={styles.modalButton} >
                                        Label
                                    </Button></Row>
                                </Col>
                                
                            )}
                            {/* Refactor later: can't diagnose why current color doesn't update upon rerender, temporary suboptimal solution */}
                            {/* {currSetting=='themes' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )}  */}
                            {currSetting=='themes' && currSubSetting=='Background Color' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )} 
                            {currSetting=='themes' && currSubSetting=='Note Color' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )}
                            {currSetting=='themes' && currSubSetting=='Primary Button Color' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )}
                            {currSetting=='themes' && currSubSetting=='Secondary Button Color' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )}
                            {currSetting=='themes' && currSubSetting=='Label' && (
                                <Col xs={9}>
                                <PhotoshopPicker 
                                    className={styles.photoshopPicker}
                                    header={currSubSetting}
                                    color={currColor}
                                    onAccept={() => {handleAccept(currSubSetting)}}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                />
                                </Col>
                            )}
                            {currSetting=='layout' && (
                                <Col>Layout</Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Modal.Body>
    </Modal>
}