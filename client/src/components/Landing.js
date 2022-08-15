import React, {useEffect, useState} from "react";
import image from "../imageFinal.jpg";
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import jwt_decode from 'jwt-decode';

function Landing() {

    let navigate = useNavigate();

    function handleCallbackResponse (response) {
        console.log("Encoded JWT ID token: " + response.credential);
        let userObject = jwt_decode(response.credential);
        console.log(userObject);
        navigate('/dashboard', {state: {logged: true, name: userObject.name, email: userObject.email, picture: userObject.picture, first: userObject.given_name}});
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "1047047016732-j8s9f0t36aqqcs2hf4cnqtqj3fi2ckdn.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            {theme: "outline", size: "large"}
        );

    }, []);

    return (
        <div>
            <div style={{paddingLeft: '70px', display: 'flex'}}>
                <img src={image} style={{flex: '0.5', paddingTop: '80px'}}/>
                <div style={{flex: '0.5', paddingLeft: '100px', paddingTop: '120px'}}>
                    <h1 style={{color: 'red', fontFamily: 'Akaya Kanadaka', paddingLeft: '110px'}}>
                        Daily<span style={{color: 'black'}}>Read</span>
                    </h1>
                    <text style={{fontFamily: 'Garamond', fontSize: '20px', paddingLeft: '50px'}}>Stay updated on your favourite topics</text>

                    <div id="signInDiv" style={{paddingTop: '25px', paddingLeft: '100px', paddingRight: '100px'}}>

                    </div>
                    <text style={{paddingTop: '5px', paddingLeft: '190px', fontFamily: 'Garamond', fontSize: '20px'}}>or</text>
                    <div style={{paddingTop: '5px', paddingLeft: '95px'}}>
                        <Button variant="contained" color="error" size="large" endIcon={<ArrowForwardIosIcon />} onClick={() => {navigate('/dashboard', {state: {logged: false}})}}>Start browsing</Button>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Landing;