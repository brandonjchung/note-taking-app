import { Button, ButtonGroup, Col, Form, Modal, Row  } from "react-bootstrap"
import { siteStyles } from "../interfaces/siteStyles";
import { PhotoshopPicker  } from "react-color" 
import { useState } from "react";

import styles from './SettingsModal.module.css'

type SettingsModalProps = {
    show: boolean,
    siteStyles: siteStyles
    setBackgroundColor: (color: string) => void,
    setNoteColor: (color: string) => void,
    setPrimaryButtonColor: (color: string) => void,
    setSecondaryButtonColor: (color: string) => void,
    setLabelColor: (color: string) => void,
    setModalIsOpen: (state: boolean) => void
}

export function SettingsModal( props : SettingsModalProps ) {
    interface colorObj {
        hex: string
    };

    const [currSetting, setCurrSetting] = useState('profile');
    const [currSubSetting, setCurrSubSetting] = useState('Background Color');
    const [currColor, setCurrColor] = useState(props.siteStyles.background);

    const handleAccept = ( currSubSetting: string ) => {
        if(currSubSetting == 'Background Color'){
            props.setBackgroundColor(currColor);
        }
        else if(currSubSetting == 'Note Color'){
            props.setNoteColor(currColor);
        }
        else if(currSubSetting == 'Primary Button Color'){
            props.setPrimaryButtonColor(currColor);
        }
        else if(currSubSetting == 'Secondary Button Color'){
            props.setSecondaryButtonColor(currColor);
        }
        else if(currSubSetting == 'Label'){
            props.setLabelColor(currColor);
        }
        // try like event stop propogationn or something here
    };

    const handleChange = (color: colorObj) => {
        setCurrColor(color.hex);
    };

    const handleCancel = () => {
        // setShowBackgroundColorPicker(false);
        switch(currSubSetting){
            case 'Background Color':
                return setCurrColor(props.siteStyles.background);
            case 'Note Color':
                return setCurrColor(props.siteStyles.note);
            case 'Primary Button Color':
                return setCurrColor(props.siteStyles.primary);
            case 'Secondary Button Color':
                return setCurrColor(props.siteStyles.secondary);
            case 'Label':
                return setCurrColor(props.siteStyles.label);
        }
    };

    const handleSubtheme = ( currSubSetting: string ) => {
        setCurrSubSetting(currSubSetting);

        switch(currSubSetting){
            case 'Background Color':
                return setCurrColor(props.siteStyles.background);
            case 'Note Color':
                return setCurrColor(props.siteStyles.note);
            case 'Primary Button Color':
                return setCurrColor(props.siteStyles.primary);
            case 'Secondary Button Color':
                return setCurrColor(props.siteStyles.secondary);
            case 'Label':
                return setCurrColor(props.siteStyles.label);
        }
    };

    const primaryStyleProps = {
        background: props.siteStyles.primary, 
        borderColor: props.siteStyles.primary, 
        color:props.siteStyles.label,
    };
    
    const secondaryStyleProps = {
        background: props.siteStyles.secondary, 
        borderColor: props.siteStyles.secondary, 
        color:props.siteStyles.label,
    };

    return <Modal size="xl" show={props.show} onHide={() => {props.setModalIsOpen(false)}} centered>
        <Modal.Header style={{ background: props.siteStyles.background }} closeButton></Modal.Header>
        <Modal.Body style={{ background: props.siteStyles.background, color: props.siteStyles.label, height: window.innerHeight*.6 }} >
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