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
            document.getElementById('signInDiv')
        );

    }, []);

    return (
        <div>
            <div style={{display: 'flex', paddingLeft: '90px', paddingTop: '30px'}}>
                <div style={{flex: '0.3'}}>
                    <text style={{color: 'red', fontFamily: 'Arial', fontSize: '20px'}}>Daily<span style={{color: 'black'}}>Read</span></text>
                </div>

                <div style={{paddingLeft: '600px'}}>
                    <text style={{fontFamily: 'Garamond'}}>Product</text>
                </div>

                <div style={{paddingLeft: '50px'}}>
                    <text style={{fontFamily: 'Garamond'}}>Pricing</text>
                </div>

                <div style={{paddingLeft: '50px'}}>
                    <text style={{fontFamily: 'Garamond'}} onClick={() => window.location.replace('https://github.com/Jahnavi-1704/DailyRead')}>Github</text>
                </div>

                <div style={{paddingLeft: '50px'}}>
                    <Button variant="outlined" color="error" size="small" onClick={() => {navigate('/dashboard', {state: {logged: false}})}}>Try for free</Button>
                </div>

                <div style={{paddingLeft: '30px'}} id="signInDiv">
                    <Button variant="contained" color="error" size="small">Log in</Button>
                </div>

            </div>
            <div style={{paddingLeft: '70px', display: 'flex', paddingRight: '70px'}}>
                <div style={{flex: '0.4', paddingTop: '100px'}}>
                    <div style={{paddingLeft: '15px', paddingRight: '50px'}}>
                        <text style={{fontFamily: 'Arial', fontSize: '50px', fontWeight: 'bolder'}}>Stay up to date on your favourite topics.</text>
                    </div>

                    <div style={{paddingLeft: '15px', paddingRight: '50px', paddingTop: '25px'}}>
                        <text style={{fontFamily: 'Publica Sans Regular', fontSize: '18px', color: 'grey'}}>
                            Create a curated list of articles you are interested in and save them for future reading. Try it now!
                        </text>
                    </div>

                    {/*<div id="signInDiv" style={{paddingTop: '25px', paddingLeft: '100px', paddingRight: '100px'}}></div>*/}
                    <div style={{paddingTop: '25px', paddingLeft: '15px'}}>
                        <Button variant="contained" color="error" size="large" endIcon={<ArrowForwardIosIcon />} onClick={() => {navigate('/dashboard', {state: {logged: false}})}}>Start browsing</Button>
                    </div>

                </div>
                <img src={image} style={{flex: '0.6', paddingTop: '30px'}}/>
            </div>

        </div>
    );
}

export default Landing;