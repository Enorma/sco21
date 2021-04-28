import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';

const NavTop = ({props}) => {

    const {user, logout} = useContext(UserContext);

    const logOutHandler = async () => {
        await logout();
        return;
    };

    return(
        <Navbar variant="light" bg="light" expand="md" className="w-100 border-bottom border-left border-right rounded-bottom">

            <Link to="/login"><Navbar.Brand>Sistema SCO21</Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">

                    {!user.logged && <Nav.Link eventKey="loggedout" disabled className="text-info">Por favor ingresa tus credenciales.</Nav.Link>}
                    {user.logged && <Nav.Link onClick={logOutHandler}>Log Out</Nav.Link>}
                    {user.logged && user.type==="admin" && (<>
                        <Link to="/admingrupo"><Nav.Link disabled className="text-info">Alta de Grupo</Nav.Link></Link>
                        <Link to="/adminalumno"><Nav.Link disabled className="text-info">Alta de Alumno</Nav.Link></Link>
                    </>)}
                    {user.logged && user.type==="prof" && (<>
                        <Link to="/profasistencia"><Nav.Link disabled className="text-info">Tomar Asistencia</Nav.Link></Link>
                        <Link to="/proftarea"><Nav.Link disabled className="text-info">Registrar Tarea</Nav.Link></Link>
                        <Link to="/profexamen"><Nav.Link disabled className="text-info">Registrar Examen</Nav.Link></Link>
                    </>)}
                    {user.logged && user.type==="alumtut" && (<>
                        <Link to="/alumnokardex"><Nav.Link disabled className="text-info">Consulta de Kardex</Nav.Link></Link>
                        <Link to="/alumnocalif"><Nav.Link disabled className="text-info">Consulta de Calificaciones</Nav.Link></Link>
                    </>)}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavTop;

//eof
