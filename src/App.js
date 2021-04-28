import React from 'react';
import {Route, Switch} from "react-router-dom";

import Error from "./components/Error";
import Login from "./views/Login";
import AdminGrupo from "./views/AdminGrupo";
import AdminAlumno from './views/AdminAlumno';
import ProfAsistencia from './views/ProfAsistencia';
import ProfTarea from './views/ProfTarea';
import ProfExamen from './views/ProfExamen';
import AlumnoKardex from './views/AlumnoKardex';
import AlumnoCalif from './views/AlumnoCalif';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App(props) {

    return(
        <Container fluid>
            <Row>
                <Col>
                    <Switch>
                        <Route path="/" component={Login} exact></Route>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/adminalumno" component={AdminAlumno}></Route>
                        <Route path="/admingrupo" component={AdminGrupo}></Route>
                        <Route path="/alumnocalif" component={AlumnoCalif}></Route>
                        <Route path="/alumnokardex" component={AlumnoKardex}></Route>
                        <Route path="/profasistencia" component={ProfAsistencia}></Route>
                        <Route path="/profexamen" component={ProfExamen}></Route>
                        <Route path="/proftarea" component={ProfTarea}></Route>
                        <Route component={Error}></Route>
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
}

export default App;

//eof
