import { createContext } from 'react';

const UserContext = createContext({
    "code"    : "",
    "data"    : {},
    "token"   : "",
    "type"    : "",
    "logged"  : false,
    "socket"  : null,
    "chatlog" : ""
});

export default UserContext;

//eof
