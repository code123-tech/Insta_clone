import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import M from "materialize-css";

const Signup = () => {
    const { state, dispatch } = useContext(userContext);
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    const UploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "web-pics");
        data.append("cloud_name", "swap2001");
        fetch("https://api.cloudinary.com/v1_1/swap2001/image/upload", {
                method: "post",
                body: data
            }).then(res => res.json())
            .then(data => {
                setUrl(data.url);
            }).catch(err => { console.log(err) })
    }


    const uploadFields = () => {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
            M.toast({ html: "Invalid email", classes: "#d32f2f red darken-2" });
            return null;
        }
        fetch("/signup", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    pic: url
                })
            }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
                } else {
                    M.toast({ html: data.message, classes: "#42a5f5 blue darken-1" });
                    history.push("/login");
                }
            }).catch(err => { console.log(err); })
    }

    const PostData = () => {
        if (image) {
            UploadPic()
        } else {
            uploadFields()
        }

    }
    return ( <
        div className = "myCard" >
        <
        div className = "card card-auth input-field" >
        <
        h2 >
        <
        Link to = { state ? "/" : "/signup" }
        className = "brand" > 🎬WebPics < /Link>  < /
        h2 > <
        input type = "text"
        placeholder = "name"
        value = { name }
        onChange = {
            (e) => setName(e.target.value)
        }
        /> <
        input type = "text"
        placeholder = "email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value)
        }
        /> <
        input type = "password"
        placeholder = "password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        /> 



        <
        div className = "file-field input-field" >
        <
        div className = "btn #64b5f6 blue darken-2" >
        <
        span > Upload profile pic < /span>   <
        input type = "file"
        onChange = {
            (e) => setImage(e.target.files[0])
        }
        />  <
        /div>  <
        div className = "file-path-wrapper" >
        <
        input className = "file-path validate"
        type = "text" / >
        <
        /div>    <
        /div>




        <
        button className = "btn waves-effect waves-light #64b5f6 blue darken-2"
        onClick = {
            () => PostData()
        } >
        Signup <
        /button> <
        h5 >
        <
        Link to = "/Login" > Already have an account ? < /Link>  < /
        h5 > <
        /div> < /
        div >
    )
}

export default Signup;