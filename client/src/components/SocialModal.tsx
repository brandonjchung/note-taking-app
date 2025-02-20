import { Button, ButtonGroup, Col, Form, Modal, Row, Image, Stack, Tab, Nav } from "react-bootstrap"
import { useState, useRef } from "react";

import { SocialConversations } from "./SocialConversations";
import { SocialFriends } from "./SocialFriends";

import { useUser } from "./UserContext"

import { ADD_FRIENDS_KEY, CONVERSATIONS_KEY, FRIENDS_KEY } from "../assets/globalStrings";

type SocialModalProps = {
    show: boolean,
    setModalIsOpen: (state: boolean) => void
}

export function SocialModal( props : SocialModalProps ) {
    const { user, setUser } = useUser();
    const [ activeTab, setActiveTab ] = useState(FRIENDS_KEY);
    
    const resetModalValues = () => {
        props.setModalIsOpen(false);
    }

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
        <Modal.Header style={{ background: user?.stylePreferences?.backgroundColor, border:'none' }} closeButton></Modal.Header>
        <Modal.Body style={{ display:"flex", flexDirection:'column', background: user?.stylePreferences?.backgroundColor, color: user?.stylePreferences?.labelColor, height: window.innerHeight*.8 }} >
            <Tab.Container activeKey={activeTab} onSelect={(eventKey) => setActiveTab(eventKey!)}>
                <Nav variant="tabs" >
                    <Nav.Item>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={FRIENDS_KEY}>Your Friends</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={ADD_FRIENDS_KEY}>Add Friends</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="flex-grow-1 p-3">
                    <Tab.Pane className="h-100" eventKey={CONVERSATIONS_KEY}>
                        <SocialConversations/>
                    </Tab.Pane>
                    <Tab.Pane  className="h-100" eventKey={FRIENDS_KEY}> 
                        <SocialFriends/>
                    </Tab.Pane>
                    <Tab.Pane  className="h-100" eventKey={ADD_FRIENDS_KEY}> 
                        <SocialFriends/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Modal.Body>
    </Modal>
}