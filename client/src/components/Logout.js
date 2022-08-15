import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";

function Login() {
    const clientID = "1047047016732-qmr85oj40paf6g1udaso78em37h4frkf.apps.googleusercontent.com";

    const onSuccess = (res) => {
        console.log('Logout success!');
    }

    let navigate = useNavigate();

    useEffect(() => {

        // after success logout, navigate to landing screen
        navigate('/landing');
    });

    return (
        <div>
            <googleLogout
                clientId={clientID}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    );
}

export default Login;