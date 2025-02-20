import { Button, Col, Row } from "react-bootstrap"

import { useUser } from "./UserContext"

export function SocialConversations(){
    const { user, setUser } = useUser();

    return (
        <>
        <Row className="d-flex h-100">
            <Col xs={4} className="overflow-auto h-100">
                <Row>Rows</Row>
            </Col>
            <Col xs={8} className="overflow-auto flex-grow-1">chat</Col>
        </Row>
        </>
    )
}   
