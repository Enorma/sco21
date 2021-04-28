import React, { useState } from 'react';
import UserContext from './UserContext';
import chaturl from "./config/chatcfg";
import moment from "moment";

const UserProvider = ({children}) => {

    const [user, setUser] = useState({
        "code"    : "",
        "data"    : {},
        "token"   : "",
        "type"    : "",
        "logged"  : false,
        "socket"  : null,
        "chatlog" : ""
    });

    const login = async newuser => {

        //enviar codigo/pass al backend
        //traer un token y la data

        //iniciar sesión en el chat

        const newcode = (newuser.userdata && newuser.userdata.codigo) ? newuser.userdata.codigo : "foo";
        const newname = (newuser.userdata && newuser.userdata.nombre) ? newuser.userdata.nombre : "foo";

        const ws = await new WebSocket(chaturl);

        ws.onopen = () => {
            console.log("Web Socket open on:", chaturl);
        };

        ws.onclose = () => {
            console.log("Web Socket closed.");
        };

        ws.onmessage = event => {

            console.log(event.data); //aquí cae el response del server
            const data = JSON.parse(event.data);

            if(data.method==="update") {
                const timestamp = moment().format("YYYY/MM/DD - HH:mm:SS");
                setUser({
                    ...user,
                    "chatlog" : user.chatlog+"\n[ "+timestamp+" - "+data.params.username+" ] "+data.params.message
                });
                //setMessage("");
            }

            return;
        };

        const chatEntry = {
            "id" : 1,
            "method" : "username",
            "params" : {
                "username" : newname
            }
        };

        console.log("logging in...");
        await new Promise(r => setTimeout(r, 2000)); //sleep
        console.log("logged in.");

        ws.send(JSON.stringify(chatEntry));

        setUser({
            "code"    : newcode, //cambiar con el código del login form
            "data"    : newuser.userdata, //cambiar con la data de la BD
            "token"   : newuser.token, //cambiar con el token generado
            "type"    : newuser.type, //cambiar con la data de la BD (profe, alumno, admin o tutor)
            "logged"  : true,
            "socket"  : ws,
            "chatlog" : ""
        });

        return;
    };

    const logout = async () => {

        //await user.socket.close("Account logout."); //no jala esta pendejadaaaaaaa

        setUser({
            "code"    : "",
            "data"    : {},
            "token"   : "",
            "type"    : "",
            "logged"  : false,
            "socket"  : null,
            "chatlog" : ""
        });

        return;
    };

    return(
        <UserContext.Provider value={{user, login, logout, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;

//eof
