import React, { useState, useContext } from 'react';
import {Redirect} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import NavTop from '../components/NavTop';
import requester from "../config/axioscfg";

import UserContext from '../UserContext';

const AdminAlumno = ({props}) => {

    const [grupo,  setGrupo]  = useState("a");
    const [sexo,   setSexo]   = useState("F");
    const [nombre, setNombre] = useState("");
    const [apater, setAPater] = useState("");
    const [amater, setAMater] = useState("");
    const [tutor,  setTutor]  = useState("");
    const [email,  setEmail]  = useState("");

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const handleChange = (value, setter) => {
        setter(value);
        return;
    };

    const submitHandler = async () => {

        const newalumno = {
            "nombre"     : nombre,
            "apellidop"  : apater,
            "apellidom"  : amater,
            "tutor"      : tutor,
            "sexo"       : sexo,
            "emailtutor" : email,
            "grupo"      : grupo
        };

        const ruta = encodeURI(`/alumnos`);

        try {
            const result = await requester.post(ruta, newalumno);

            if(result.status>=200 && result.status<300) {
                console.log("post ok");
                alert("Alumno nuevo guardado correctamente.");
                return;
            }else {
                console.log("Error de comunicación 1:", result.data.message);
                alert("Ocurrió un error. Por favor intenta de nuevo.");
                return;
            }
        }catch(error) {
            console.log("Error de comunicación 2:", error);
            alert("Ocurrió un error. Por favor intenta de nuevo.");
            return;
        }
    };

    return (
        <Container fluid>
            <Row><NavTop /></Row>
            <Form>
                <Form.Group className="mt-3" controlId="formGrupo">
                    <Form.Label>Grupo</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => setGrupo(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">{grupo.toUpperCase()}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="a">A</Dropdown.Item>
                            <Dropdown.Item eventKey="b">B</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formSexo">
                    <Form.Label>Sexo</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => setSexo(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">{sexo}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="F">F</Dropdown.Item>
                            <Dropdown.Item eventKey="M">M</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Nombre..." value={nombre} onChange={({target: {value}}) => handleChange(value, setNombre)} />
                </Form.Group>

                <Form.Group controlId="formApellidoP">
                    <Form.Label>Apellido Paterno</Form.Label>
                    <Form.Control type="text" placeholder="Apellido Paterno..." value={apater} onChange={({target: {value}}) => handleChange(value, setAPater)} />
                </Form.Group>

                <Form.Group controlId="formApellidoM">
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control type="text" placeholder="Apellido Materno..." value={amater} onChange={({target: {value}}) => handleChange(value, setAMater)} />
                </Form.Group>

                <Form.Group controlId="formTutor">
                    <Form.Label>Nombre y Apellido del Padre/Madre/Tutor</Form.Label>
                    <Form.Control type="text" placeholder="Nombre Tutor..." value={tutor} onChange={({target: {value}}) => handleChange(value, setTutor)} />
                </Form.Group>

                <Form.Group controlId="formEmailTutor">
                    <Form.Label>E-Mail del Padre/Madre/Tutor</Form.Label>
                    <Form.Control type="email" placeholder="E-Mail Tutor..." value={email} onChange={({target: {value}}) => handleChange(value, setEmail)} />
                </Form.Group>

                <Form.Group>
                    <Button variant="success" className="w-50" onClick={submitHandler}>GUARDAR</Button>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default AdminAlumno;

//eof
