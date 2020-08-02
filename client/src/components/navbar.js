import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
import M from "materialize-css";
const NavBar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);
    const renderList = () => {
        if (state) {
            return [ <
                li > < Link to = "/profile" > Profile < /Link> </li > , <
                li > < Link to = "/createpost" > CreatePost < /Link></li > , <
                li > < Link to = "/myfollowingpost" > My following Posts < /Link></li > , <
                li >
                <
                button className = "btn #d32f2f red darken-2"
                onClick = {
                    () => {
                        localStorage.clear();
                        dispatch({ type: "clear" });
                        history.push("/login");
                        M.toast({ html: "You are Logged out", classes: "#d32f2f green darken-2" })
                    }
                } >
                Logout < /button> </li >
            ]
        } else {
            return [ <
                li >
                <
                Link to = "/login" > Login < /Link> < /
                li > , <
                li >
                <
                Link to = "/signup" > Signup < /Link> </li >
            ]
        }
    }
    return ( <
        nav >
        <
        div className = "nav-wrapper white" >
        <
        Link to = { state ? "/" : "/login" }
        className = "brand-logo left" > 🎬WebPics < /Link>    <
        ul id = "nLinkv-mobile"
        className = "right" > { renderList() } < /ul>   < /
        div > <
        /nav>
    )
}
export default NavBar;