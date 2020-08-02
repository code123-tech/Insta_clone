import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
const Profile = () => {
    const { state, dispatch } = useContext(userContext);
    const [myPics, setPics] = useState([]);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch("/mypost", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                setPics(result.mypost);
            })
    }, []);
    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "web-pics");
            data.append("cloud_name", "swap2001");
            fetch("https://api.cloudinary.com/v1_1/swap2001/image/upload", {
                    method: "post",
                    body: data
                }).then(res => res.json())
                .then(data => {
                    fetch("/updatepic", {
                            method: "put",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem("jwt")
                            },
                            body: JSON.stringify({
                                pic: data.url
                            })
                        }).then(res => res.json())
                        .then(result => {
                            console.log(result);
                            localStorage.setItem("user", JSON.stringify({...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic });
                        })
                }).catch(err => { console.log(err) })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file);
    }

    return ( <
        div className = "profile-div" >
        <
        div className = "profilepicDiv" >
        <
        div className = "profileDiv" >
        <
        div >
        <
        img className = "profileimg"
        src = { state ? state.pic : "loading" }
        /> < /
        div > <
        div >
        <
        h4 > { state ? state.name : "loading" } < /h4>  <
        h5 > { state ? state.email : "loading" } < /h5>  <
        div className = "followersDiv" >
        <
        h6 > { myPics.length + " " }
        posts < /h6>   <
        h6 > { state ? state.followers.length + " " : 0 }
        followers < /h6>   <
        h6 > { state ? state.following.length + " " : 0 }
        following < /h6>  < /
        div > <
        /div>  < /
        div > <
        div className = "file-field input-field" >
        <
        div className = "btn #64b5f6 blue darken-2" >
        <
        span > Update pic < /span>   <
        input type = "file"
        onChange = {
            (e) => updatePhoto(e.target.files[0])
        }
        />  < /
        div > <
        div className = "file-path-wrapper" >
        <
        input className = "file-path validate"
        type = "text" / >
        <
        /div>    < /
        div > <
        /div> <
        div className = "gallery" > {
            myPics.length != 0 ?
            myPics.map(item => {
                return <img key = { item._id }
                className = "item item1"
                src = { item.photo }
                alt = { item.title }
                />
            }) :
                <
                h1 > No Posts Yet... < /h1>
        } < /div>   < /
        div >
    )
}

export default Profile;