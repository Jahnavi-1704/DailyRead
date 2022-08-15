import React, {useState} from "react";
import {useLocation} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";

function Profile() {

    let location = useLocation();
    let navigate = useNavigate();
    const [name, setName] = useState(location.state.name);
    const [email, setEmail] = useState(location.state.email);
    const [picture, setPicture] = useState(location.state.picture);
    const firstName = location.state.firstName;
    const userArticles = location.state.articles;

    return (
        <div style={{paddingLeft: '600px', paddingTop: '120px'}}>
            <div style={{paddingLeft: '70px'}}>
                <img src={picture} />
            </div>
            <div style={{paddingLeft: '10px'}}>
                <text style={{fontFamily: 'Garamond', fontWeight: 'bold', fontSize: '40px'}}>My Account</text>
            </div>
            <div style={{paddingLeft: '40px'}}>
                <text style={{fontFamily: 'Garamond', fontSize: '20px'}}>Name: {name}</text>
            </div>
            <div>
                <text style={{fontFamily: 'Garamond', fontSize: '20px'}}>Email: {email}</text>
            </div>
            <div style={{paddingTop: '20px', paddingRight: '15px'}}>
                <Button variant="contained" color="error" size="large" endIcon={<ArrowForwardIosIcon />} onClick={() => {navigate('/savedArticles', {state: {email: email, articles: userArticles, name: firstName}})}}>View my saved articles</Button>
            </div>
        </div>
    );
}

export default Profile;