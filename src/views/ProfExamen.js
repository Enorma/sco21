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

const tiposexamen = {
    "parcial"   : "Parcial",
    "mensual"   : "Mensual",
    "bimestral" : "Bimestral",
    "semestral" : "Semestral",
    "final"     : "Final"
};

const nombresgrupos = {
    "1a":"1A",
    "1b":"1B",
    "2a":"2A",
    "2b":"2B",
    "3a":"3A",
    "3b":"3B"
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

const ProfExamen = ({props}) => {

    const [examType,  setExamType]  = useState("parcial");
    const [nameGrupo, setNameGrupo] = useState("1a");
    const [materia,   setMateria]   = useState(null);
    const [calif,     setCalif]     = useState((new Array(20)).fill("0"));

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const grupos = user.data.grupos;

    if(!materia) {
        setMateria(grupos[Object.keys(grupos)[0]].materias[0].slice(0,3));
    }

    const updateGrupoAndMateria = grupokey => {
        setNameGrupo(grupokey);
        setMateria(grupos[grupokey].materias[0].slice(0,3));
        setCalif((new Array(20)).fill("0"));
    };

    const updateMateriaAndCalif = materiakey => {
        setMateria(materiakey);
        setCalif((new Array(20)).fill("0"));
    }

    const numHandler = (value, index) => {

        const numvalue = parseInt(value);
        const newcalifs = [...calif];

        if(!isNaN(numvalue) && numvalue>=0 && numvalue<=100) {
            newcalifs[index] = numvalue.toString();
        }else if(isNaN(numvalue) || numvalue<0) {
            newcalifs[index] = "0";
        }else if(numvalue>100) {
            newcalifs[index] = "100";
        }

        setCalif(newcalifs);
        return;
    };

    let grupos_arr = [];
    const grupos_nombres = Object.keys(grupos);
    const grupos_pares   = Object.entries(grupos_nombres);
    if(grupos_pares.length>0) {
        grupos_arr = grupos_pares.map(g => <Dropdown.Item key={""+g[0]} eventKey={g[1]}>{g[1].toUpperCase()}</Dropdown.Item>);
    }

    let materias_arr = [];
    const listamaterias = grupos[nameGrupo].materias;
    const materias_pares = Object.entries(listamaterias);
    if(materias_pares.length>0) {
        materias_arr = materias_pares.map(m => <Dropdown.Item key={""+m[0]} eventKey={m[1].slice(0,3)}>{nombrematerias[m[1].slice(0,3)] +" "+ m[1].slice(3)}</Dropdown.Item>)
    }

    let alumnos_arr = [];
    const listalumnos = grupos[nameGrupo].alumnos;
    const alumnos_pares = Object.entries(listalumnos);
    if(alumnos_pares.length>0) {
        alumnos_arr = alumnos_pares.map(a => (<Form.Group key={a[1].idalumno} as={Row} controlId={"alumno"+a[1].idalumno} className="m-0">
            <Form.Label className="border" column sm="2">{a[1].nombre}</Form.Label>
            <Col sm="2" className="border"><Form.Control type="number" placeholder="0 - 100" value={calif[a[0]]} onChange={({target:{value}}) => numHandler(value, a[0])} /></Col>
        </Form.Group>));
    }

    const submitHandler = async () => {

        const payloadcalifs = {};
        for(let i=0; i<20; i++) {
            payloadcalifs[listalumnos[i].idalumno] = parseInt(calif[i]);
        }

        //"/entrega/:tipo/:namegrupo/:materia/:nombre"
        const ruta = encodeURI(`/entrega/exams/${nameGrupo}/${materia+(nameGrupo.slice(0,1))}/${examType}`);

        try {
            const result = await requester.post(ruta, payloadcalifs);

            if(result.status>=200 && result.status<300) {
                console.log("post ok");
                alert("Exámenes guardados correctamente.");
                return;
            }else {
                console.log("Error de comunicación:", result.data.message);
                alert("Ocurrió un error. Por favor intenta de nuevo.");
                return;
            }
        }catch(error) {
            console.error("Error de comunicación:", error);
            alert("Ocurrió un error. Por favor intenta de nuevo.");
            return;
        }
    };

    return (
        <Container fluid>
            <Row><NavTop /></Row>
            <Form>
                <Form.Group className="mt-3" controlId="formPeriodo">
                    <Form.Label>Periodo de Examen</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => setExamType(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {tiposexamen[examType]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="parcial">Parcial</Dropdown.Item>
                            <Dropdown.Item eventKey="mensual">Mensual</Dropdown.Item>
                            <Dropdown.Item eventKey="bimestral">Bimestral</Dropdown.Item>
                            <Dropdown.Item eventKey="semestral">Semestral</Dropdown.Item>
                            <Dropdown.Item eventKey="final">Final</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formGrupo">
                    <Form.Label>Grupo</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => updateGrupoAndMateria(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {nombresgrupos[nameGrupo]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {grupos_arr}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formMateria">
                    <Form.Label>Materia</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => updateMateriaAndCalif(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {nombrematerias[materia]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {materias_arr}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group>
                    {alumnos_arr}
                </Form.Group>

                <Form.Group>
                    <Button variant="success" className="w-25" onClick={submitHandler}>GUARDAR</Button>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default ProfExamen;

//eof
