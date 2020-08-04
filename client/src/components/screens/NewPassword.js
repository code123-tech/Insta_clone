import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { userContext } from "../../App";
import M from "materialize-css";
const Password = () => {
    const { state, dispatch } = useContext(userContext);
    const history = useHistory();
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const PostData = () => {
        fetch("/new-password", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    password,
                    token
                })
            }).then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
                } else {
                    M.toast({ html: data.message, classes: "#42a5f5 green darken-1" });
                    history.push("/login");
                }
            }).catch(err => { console.log(err); })
    }

    return ( <
        div className = "myCard" >
        <
        div className = "card card-auth input-field" >
        <
        h2 >
        <
        Link to = { state ? "/" : "/login" }
        className = "brand" > 🎬WebPics < /Link>     < /
        h2 > <
        input type = "password"
        placeholder = "Enter new password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        />   <
        button className = "btn waves-effect waves-light #64b5f6 blue darken-2"
        onClick = {
            () => PostData()
        } >
        Submit password < /button> </div >
        <
        /div>
    )
}

export default Password;