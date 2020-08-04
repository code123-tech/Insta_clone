import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import M from "materialize-css";
const Reset = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);
    const [email, setEmail] = useState("");
    const PostData = () => {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
            M.toast({ html: "Invalid email", classes: "#d32f2f red darken-2" });
            return null;
        }
        fetch("/reset-password", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                })
            }).then(res => res.json())
            .then(data => {
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
        className = "brand" > 🎬WebPics < /Link>     <
        /h2>  <
        input type = "text"
        placeholder = "email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value)
        }
        />     <
        button className = "btn waves-effect waves-light #64b5f6 blue darken-2"
        onClick = {
            () => PostData()
        } >
        Reset Password < /button>    <
        /div>  </div >
    )
}

export default Reset;