import React, { useState, useContext } from 'react';
import {Redirect} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import NavTop from '../components/NavTop';
import UserContext from '../UserContext';

const AlumnoCalif = ({props}) => {

    const [show,    setShow]    = useState("faltas");
    const [materia, setMateria] = useState("mat");

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const alumnoej = user.data;

    let faltas_arr = [];
    if(alumnoej.faltas) {
        let i=0;
        let uniquefaltas = [...new Set(alumnoej.faltas)];
        uniquefaltas = uniquefaltas.sort();
        faltas_arr = uniquefaltas.map(f => <Row key={"f"+(++i)}><Col className="border">{f}</Col></Row>);
    }

    let tareas_arr = [];
    if(alumnoej.grado && alumnoej.tareas && alumnoej.tareas[materia+alumnoej.grado]) {
        const tareas_materia = Object.entries(alumnoej.tareas[materia+alumnoej.grado]);
        tareas_arr = tareas_materia.map(t => <Row key={t[0]}><Col xs={3} className="border">{t[0]}</Col><Col className="border">{t[1]}</Col></Row>);
    }

    let exams_arr = [];
    if(alumnoej.grado && alumnoej.exams && alumnoej.exams[materia+alumnoej.grado]) {
        const exams_materia = Object.entries(alumnoej.exams[materia+alumnoej.grado]);
        exams_arr = exams_materia.map(e => <Row key={e[0]}><Col xs={3} className="border">{e[0]}</Col><Col className="border">{e[1]}</Col></Row>);
    }

    const contents = {
        "faltas" : "Faltas",
        "tareas" : "Tareas",
        "exams"  : "Exámenes"
    };

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

    return (
        <Container fluid>
            <Row><NavTop /></Row>

            <Form>
                <Form.Group controlId="formGrupo">
                    <Form.Label>Consulta</Form.Label>
                    <Dropdown onSelect={(eventkey, event) => setShow(eventkey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {contents[show]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="faltas">Faltas</Dropdown.Item>
                            <Dropdown.Item eventKey="tareas">Tareas</Dropdown.Item>
                            <Dropdown.Item eventKey="exams">Exámenes</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                {show!=="faltas" && (<Form.Group controlId="formGrupo">
                    <Form.Label>Materia</Form.Label>
                    <Dropdown onSelect={(eventkey, event) => setMateria(eventkey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {nombrematerias[materia]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="mat">Matemáticas</Dropdown.Item>
                            <Dropdown.Item eventKey="esp">Español</Dropdown.Item>
                            <Dropdown.Item eventKey="fis">Física</Dropdown.Item>
                            <Dropdown.Item eventKey="qui">Química</Dropdown.Item>
                            <Dropdown.Item eventKey="bio">Biología</Dropdown.Item>
                            <Dropdown.Item eventKey="ing">Inglés</Dropdown.Item>
                            <Dropdown.Item eventKey="edf">Educación Física</Dropdown.Item>
                            <Dropdown.Item eventKey="art">Educación Artística</Dropdown.Item>
                            <Dropdown.Item eventKey="com">Computación</Dropdown.Item>
                            <Dropdown.Item eventKey="cye">Formación Cívica y Ética</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>)}
            </Form>

            {show==="faltas" && (<>
                <Row><Col className="border">Faltas</Col></Row>
                {faltas_arr}
            </>)}

            {show==="tareas" && (<>
                <Row><Col className="border">{"Tareas de "+nombrematerias[materia]}</Col></Row>
                {tareas_arr}
            </>)}

            {show==="exams" && (<>
                <Row><Col className="border">{"Exámenes de "+nombrematerias[materia]}</Col></Row>
                {exams_arr}
            </>)}
        </Container>
    );
};

export default AlumnoCalif;

//eof
