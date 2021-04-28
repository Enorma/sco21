import React, {useState, useContext} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import NavTop from '../components/NavTop';
import requester from "../config/axioscfg";
import UserContext from '../UserContext';
import chaturl from "../config/chatcfg";
import moment from "moment";

const Login = ({props}) => {

    const [code,    setCode]    = useState("");
    const [pass,    setPass]    = useState("");
    const [message, setMessage] = useState("");

    const {user, login, setUser} = useContext(UserContext);

    if(!user.logged && message.length>0 && user.chatlog.length>0) {
        setMessage("");
        setUser({...user, "chatlog":""});
        return;
    }

    const handleChange = (value, setter) => {
        setter(value);
        return;
    };

    const handleSubmit = async () => {

        const tryuser = {
            "code" : code,
            "pass" : pass
        }

        const ruta = encodeURI("/login");

        try {
            const result = await requester.post(ruta, tryuser);

            if(result.status>=200 && result.status<300) {
                console.log("auth ok");

                await login(result.data);

                setPass("");
                alert("Bienvenid@ al sistema SCO21.");
                return;
            }else {
                console.log("error de autenticación:", result.data.error);
                setPass("");
                alert("Error de autenticación, por favor intenta de nuevo.");
                return;
            }
        }catch(error) {
            console.error("error de autenticación:", error);
            setPass("");
            alert("Error de autenticación, por favor intenta de nuevo.");
            return;
        }
    };

    //--------------------------------------------------

    //definir eventos del socket (solo después de que el socket exista)
    if(user.socket) {

        user.socket.onopen = () => {
            console.log("Web Socket open on:", chaturl);
        };

        user.socket.onclose = () => {
            console.log("Web Socket closed.");
        };

        user.socket.onmessage = event => {

            console.log(event.data); //aquí cae el response del server
            const data = JSON.parse(event.data);

            if(data.method==="update") {
                const timestamp = moment().format("YYYY/MM/DD - HH:mm:SS");
                setUser({
                    ...user,
                    "chatlog" : user.chatlog+"\n[ "+timestamp+" - "+data.params.username+" ] "+data.params.message
                });
                setMessage("");
            }

            return;
        };
    }

    //handler del ENTER para no recargar la página
    const chatHandler = event => {
        event.preventDefault();
        return;
    };

    const msgChange = event => {
        event.preventDefault();
        setMessage(event.target.value);
        return;
    };

    const msgClick = () => {

        if(message.length===0) {
            return;
        }

        const msgpack = {
            "method" : "message",
            "params" : {
                "message"  : message,
                "username" : user.data.nombre
            }
        };

        user.socket.send(JSON.stringify(msgpack));

        setMessage("");
        return;
    };

    //--------------------------------------------------

    return (
        <Container fluid>
            <Row><NavTop /></Row>

            <Row className="justify-content-center mt-5">
                <Col>
                    <Form className="border p-5 rounded" onSubmit={chatHandler}>

                        {!user.logged && (<>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="text" placeholder="Identifícate..." value={code} onChange={({target:{value}}) => handleChange(value, setCode)} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Ingresa tu contraseña..." value={pass} onChange={({target:{value}}) => handleChange(value, setPass)} />
                            </Form.Group>
                            <Button variant="light" onClick={handleSubmit} className="bg-info text-light w-100 mt-4">
                                ENTRAR
                            </Button>
                        </>)}

                        {user.logged && (<>
                            <Form.Group>
                                <Form.Label>Chat:</Form.Label>
                                <Form.Control as="textarea" readOnly value={user.chatlog} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nuevo mensaje:</Form.Label>
                                <Form.Control as="input" value={message} onChange={msgChange} />
                                <Button variant="success" className="w-100 mt-2" onClick={msgClick}>ENVIAR</Button>
                            </Form.Group>
                        </>)}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

//eof
