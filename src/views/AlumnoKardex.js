import React, { useContext } from 'react';
import {Redirect} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavTop from '../components/NavTop';
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

const AlumnoKardex = ({props}) => {

    const {user} = useContext(UserContext);

    if(!user.logged) {
        return <Redirect to="/login" />
    }

    const alumnoej = user.data;

    let kardex_arr = [];
    const kardex_pares = Object.entries(alumnoej.calif);
    kardex_arr = kardex_pares.map(r => <Row key={r[0]}><Col xs={3} className="border">{nombrematerias[r[0].slice(0,3)]+" "+r[0].slice(3)}</Col><Col className="border">{r[1]}</Col></Row>);

    return (
        <Container fluid>
            <Row><NavTop /></Row>
            <Container className="border">
                <Row><Col className="border">Kardex de Alumn@: {`${alumnoej.nombre} ${alumnoej.apellidop} ${alumnoej.apellidom}`}</Col></Row>
                {kardex_arr}
            </Container>
        </Container>
    );
};

export default AlumnoKardex;

//eof
