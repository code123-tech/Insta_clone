import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
    const { state, dispatch } = useContext(userContext);
    const [userProfile, setProfile] = useState(null);
    const { userid } = useParams();
    const [showfollow, setshowfollow] = useState(state ? !state.following.includes(userid) : true);
    useEffect(() => {
        fetch(`/user/${userid}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                console.log(result);
                setProfile(result);
            })
    }, []);

    const followUser = () => {
        fetch("/follow", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    followId: userid
                })
            }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setshowfollow(false);
            })
    }

    const unfollowUser = () => {
        fetch("/unfollow", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    unfollowId: userid
                })
            }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    const newfollow = prevState.user.followers.filter(item => item != data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newfollow
                        }
                    }
                })
                setshowfollow(true);
            })
    }
    return ( <
        >
        {
            userProfile ?
            <
            div className = "profile-div" >
            <
            div style = {
                {
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0",
                    borderBottom: "1px solid grey"
                }
            } >
            <
            div >
            <
            img style = {
                { width: "160px", height: "160px", borderRadius: "80px" }
            }
            src = { userProfile.user.pic }
            /> < /
            div > <
            div >
            <
            h4 > { userProfile.user.name } < /h4>  <
            h5 > { userProfile.user.email } < /h5>   <
            div style = {
                { display: "flex", justifyContent: "space-between", width: "108%" }
            } >
            <
            h6 > { userProfile.posts.length + " " }
            posts < /h6>   <
            h6 > { userProfile.user.followers.length + " " }
            followers < /h6>  <
            h6 > { userProfile.user.following.length + " " }
            following < /h6>   < /
            div > {
                showfollow ?
                <
                button className = "btn waves-effect waves-light #64b5f6 blue darken-2 followUnfbtn"
                onClick = {
                    () => followUser()
                } >
                Follow < /button> : <
                button className = "btn waves-effect waves-light #64b5f6 blue darken-2 followUnfbtn"
                onClick = {
                    () => unfollowUser()
                } >
                unfollow < /button>
            }

            <
            /div>   < /
            div >

            <
            div className = "gallery" > {
                userProfile.posts.map(item => {
                    return <img key = { item._id }
                    className = "item item1"
                    src = { item.photo }
                    alt = { item.title }
                    />
                })
            } <
            /div>   < /
            div > :
                <
                h2 > Loading... < /h2>
        }

        <
        />
    )
}

export default Profile;