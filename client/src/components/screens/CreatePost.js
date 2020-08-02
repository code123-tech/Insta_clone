import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        pic: url
                    })
                }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
                    } else {
                        M.toast({ html: "Created Post Successfully", classes: "#42a5f5 blue darken-1" });
                        history.push("/");
                    }
                }).catch(err => { console.log(err); })
        }
    }, [url]);
    const postDetails = () => {
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

    return ( <
        div className = "card card1 input-field" >
        <
        input type = "text"
        placeholder = "title"
        value = { title }
        onChange = {
            (e) => setTitle(e.target.value)
        }
        /> <
        input type = "text"
        placeholder = "body"
        value = { body }
        onChange = {
            (e) => setBody(e.target.value)
        }
        /> <
        div className = "file-field input-field" >
        <
        div className = "btn #64b5f6 blue darken-2" >
        <
        span > Upload Image < /span>  <
        input type = "file"
        onChange = {
            (e) => setImage(e.target.files[0])
        }
        /> < /
        div > <
        div className = "file-path-wrapper" >
        <
        input className = "file-path validate"
        type = "text" / >
        <
        /div>  < /
        div > <
        button className = "btn waves-effect waves-light #64b5f6 blue darken-2"
        onClick = {
            () => postDetails()
        } > Submit Post < /button> < /
        div >
    )
}

export default CreatePost;