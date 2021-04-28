import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const Error = props => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const imageHandler = event => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0]);
        return;
    };

    const fileUploadHandler = event => {
        const fd = new FormData();
        fd.append("image", selectedFile, selectedFile.name);
        setFileName(selectedFile.name);
        return;
    };

    return(
        <div>
            <h1>HOLA SOY ERROR</h1>
            <Link to="/">HOME</Link>
            <br/><input type="file" name="photo" id="photo" onChange={imageHandler} />
            <br/><button onClick={fileUploadHandler}>ÁMANAAAAS</button>
            <p>{fileName}</p>
        </div>
    );
};

export default Error;

//eof
