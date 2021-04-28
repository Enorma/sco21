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

const ProfTarea = ({props}) => {

    const [anio,      setAnio]      = useState(new Date().getFullYear());
    const [mes,       setMes]       = useState(new Date().getMonth());
    const [dia,       setDia]       = useState(new Date().getDate());
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

    const year = new Date().getFullYear();

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

        const sendmonth    = (parseInt(mes)+1).toString().padStart(2,"0");
        const sendday      = dia.toString().padStart(2,"0");
        const sendfulldate = `${anio}-${sendmonth}-${sendday}`;

        const payloadcalifs = {};
        for(let i=0; i<20; i++) {
            payloadcalifs[listalumnos[i].idalumno] = parseInt(calif[i]);
        }

        //"/entrega/:tipo/:namegrupo/:materia/:nombre"
        const ruta = encodeURI(`/entrega/tareas/${nameGrupo}/${materia+(nameGrupo.slice(0,1))}/${sendfulldate}`);

        try {
            const result = await requester.post(ruta, payloadcalifs);

            if(result.status>=200 && result.status<300) {
                console.log("post ok");
                alert("Tareas guardadas correctamente.");
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
                <Form.Label className="mt-3">Fecha de Entrega</Form.Label>
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

export default ProfTarea;

//eof
