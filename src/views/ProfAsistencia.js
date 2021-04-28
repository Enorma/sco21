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

const nombresgrupos = {
    "1a":"1A",
    "1b":"1B",
    "2a":"2A",
    "2b":"2B",
    "3a":"3A",
    "3b":"3B"
};

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const dias = [31,28,31,30,31,30,31,31,30,31,30,31];

const range = (start, end, step=1) => {
    let output = [];
    if(typeof(end)==='undefined') {
        end = start;
        start = 0;
    }
    for(let i=start; i<=end; i+=step) {
        output.push(i);
    }
    return output;
};

const ProfAsistencia = ({props}) => {

    const [anio,      setAnio]      = useState(new Date().getFullYear());
    const [mes,       setMes]       = useState(new Date().getMonth());
    const [dia,       setDia]       = useState(new Date().getDate());
    const [nameGrupo, setNameGrupo] = useState("1a");
    const [faltas,    setFaltas]    = useState((new Array(20)).fill("A"));

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const grupos = user.data.grupos;

    const year = new Date().getFullYear();

    const updateGrupoAndFaltas = grupokey => {
        setNameGrupo(grupokey);
        setFaltas((new Array(20)).fill("A"));
    };

    const updateFaltas = (index, cambio) => {
        const newarr = [...faltas];
        newarr[index] = cambio;
        setFaltas(newarr);
        return;
    };

    const months_pares = Object.entries(meses);
    const months_arr = months_pares.map(m => <Dropdown.Item key={m[0]} eventKey={m[0]}>{m[1]}</Dropdown.Item>);

    const cant_dias = dias[mes];
    const dias_arr = range(1,cant_dias).map(d => <Dropdown.Item key={d} eventKey={d}>{d.toString().padStart(2,"0")}</Dropdown.Item>);

    let grupos_arr = [];
    const grupos_nombres = Object.keys(grupos);
    const grupos_pares   = Object.entries(grupos_nombres);
    if(grupos_pares.length>0) {
        grupos_arr = grupos_pares.map(g => <Dropdown.Item key={""+g[0]} eventKey={g[1]}>{g[1].toUpperCase()}</Dropdown.Item>);
    }

    let alumnos_arr = [];
    const listalumnos = grupos[nameGrupo].alumnos;
    const alumnos_pares = Object.entries(listalumnos);
    if(alumnos_pares.length>0) {
        alumnos_arr = alumnos_pares.map(a => (<Form.Group key={""+a[0]} as={Row} controlId={"alumno"+a[1].idalumno} className="m-0">
            <Form.Label className="border" column sm="2">{a[1].nombre}</Form.Label>
            <Col sm="1" className="border"><Dropdown onSelect={(eventKey, event) => updateFaltas(a[0], eventKey)}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {faltas[a[0]]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="A">Asistencia</Dropdown.Item>
                    <Dropdown.Item eventKey="F">Falta</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown></Col>
        </Form.Group>));
    }

    const submitHandler = async () => {

        const sendmonth    = (parseInt(mes)+1).toString().padStart(2,"0");
        const sendday      = dia.toString().padStart(2,"0");
        const sendfulldate = `${anio}-${sendmonth}-${sendday}`;

        const faltistas = [];
        for(let i=0; i<20; i++) {
            if(faltas[i]==="F") {
                faltistas.push(listalumnos[i].idalumno);
            }
        }

        //enviar la fecha como URL param
        const ruta = encodeURI(`/faltas/${sendfulldate}`);

        try {
            const result = await requester.post(ruta, faltistas);

            if(result.status>=200 && result.status<300) {
                console.log("post ok");
                alert("Faltas guardadas correctamente.");
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
                <Form.Label className="mt-3">Fecha</Form.Label>
                <Form.Group as={Row} controlId="formFecha">
                    <Dropdown className="ml-3" onSelect={(eventKey, event) => setAnio(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {anio}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey={year}>{year}</Dropdown.Item>
                            <Dropdown.Item eventKey={year-1}>{year-1}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mx-2" onSelect={(eventKey, event) => setMes(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {meses[mes]}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {months_arr}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown onSelect={(eventKey, event) => setDia(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {dia.toString().padStart(2,"0")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {dias_arr}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="formGrupo">
                    <Form.Label>Grupo</Form.Label>
                    <Dropdown onSelect={(eventKey, event) => updateGrupoAndFaltas(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {nombresgrupos[nameGrupo]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {grupos_arr}
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

export default ProfAsistencia;

//eof
