import React, { useState, useContext } from 'react';
import {Redirect} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import NavTop from '../components/NavTop';
import requester from "../config/axioscfg";

import UserContext from '../UserContext';

const nombrematerias = {
    "mat" : "Matemáticas",
    "esp" : "Español",
    "fis" : "Física",
    "qui" : "Química",
    "bio" : "Biología",
    "ing" : "Inglés",
    "edf" : "Educación Física",
    "cye" : "Formación Cívica y Ética",
    "art" : "Educación Artística",
    "com" : "Computación"
};

const def = {
    "mat" : "APM",
    "esp" : "APM",
    "fis" : "APM",
    "qui" : "APM",
    "bio" : "APM",
    "ing" : "APM",
    "edf" : "APM",
    "cye" : "APM",
    "art" : "APM",
    "com" : "APM"
};

const AdminGrupo = ({props}) => {

    const [selectedProfes, setSelectedProfes] = useState(def);
    const [grupo,          setGrupo]          = useState("a");
    const [grado,          setGrado]          = useState("1");

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const profes = user.data.teachers;

    const profHandler = (prof, materia) => {
        const newselected = {...selectedProfes};
        newselected[materia] = prof;
        setSelectedProfes(newselected);
    };

    const assembleProfDropdown = materianame => {
        const profes_pares = Object.entries(profes);
        let profes_arr = profes_pares.map(p => <Dropdown.Item key={materianame+p[0]} eventKey={p[0]}>{p[1]}</Dropdown.Item>);
        return profes_arr;
    };

    let materias_arr = [];
    const materias_pares = Object.entries(nombrematerias);
    materias_arr = materias_pares.map(m => <Form.Group key={m[0]} as={Row} controlId={"form"+m[0]} className="m-0">
        <Form.Label className="border" column sm="3">Profesor@ de {m[1]}</Form.Label>
        <Col sm="2" className="border"><Dropdown drop="right" onSelect={(eventKey, event) => profHandler(eventKey, m[0])}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{profes[selectedProfes[m[0]]]}</Dropdown.Toggle>
            <Dropdown.Menu>{assembleProfDropdown(m[0])}</Dropdown.Menu>
        </Dropdown></Col>
    </Form.Group>);

    const updateGrupoAndProfes = namegrupo => {
        setGrupo(namegrupo);
        setSelectedProfes(def);
        return;
    };

    const updateGradoAndGrupo = namegrado => {
        setGrado(namegrado);
        setGrupo("a");
        setSelectedProfes(def);
        return;
    };

    const submitHandler = async () => {

        const payload = {};
        const selected_pares = Object.entries(selectedProfes);

        for(let i=0; i<selected_pares.length; i++) {
            payload[selected_pares[i][0]+grado] = {
                "nombre"   : nombrematerias[ selected_pares[i][0] ]+" "+grado,
                "profesor" : profes[ selected_pares[i][1] ],
                "codigo"   : selected_pares[i][1],
                "rating"   : {}
            };
        }

        const ruta = encodeURI(`/grupos/${grado+grupo}`);

        try {
            const result = await requester.post(ruta, payload);

            if(result.status>=200 && result.status<300) {
                console.log("post ok");
                alert("Grupo guardado correctamente.");
                return;
            }else {
                console.log("Error de comunicación:", result.data.message);
                alert("Ocurrió un error. Por favor intenta de nuevo.");
                return;
            }
        }catch(error) {
            console.log("Error de comunicación:", error);
            alert("Ocurrió un error. Por favor intenta de nuevo.");
            return;
        }
    };

    return (
        <Container fluid>
            <Row><NavTop /></Row>
            <Form>
                <Form.Group className="mt-3" controlId="formGrado">
                    <Form.Label>Grado Escolar</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => updateGradoAndGrupo(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">{grado+"°"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="1">1°</Dropdown.Item>
                            <Dropdown.Item eventKey="2">2°</Dropdown.Item>
                            <Dropdown.Item eventKey="3">3°</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formGrupo">
                    <Form.Label>Grupo</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => updateGrupoAndProfes(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">{grupo.toUpperCase()}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="a">A</Dropdown.Item>
                            <Dropdown.Item eventKey="b">B</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group>
                    {materias_arr}
                </Form.Group>

                <Form.Group>
                    <Button variant="success" className="w-25" onClick={submitHandler}>GUARDAR</Button>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default AdminGrupo;

//eof
