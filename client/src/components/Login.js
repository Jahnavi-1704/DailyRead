import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from "@react-oauth/google";

function Login() {
    const clientID = "1047047016732-qmr85oj40paf6g1udaso78em37h4frkf.apps.googleusercontent.com";
    const [status, setStatus] = useState(false);

    const onSuccess = (res) => {
        console.log('Login success!, Current user: ', res.profileObj);
        setStatus(true);
    }

    const onFailure = (res) => {
        console.log('Login failed!, res: ' , res);
    }

    let navigate = useNavigate();

    useEffect(() => {
        // after success login, navigate to dashboard screen
        navigate('/dashboard', {state: {logged: true}});
    }, status);

    return (
        <div>
            <GoogleLogin
                client_id={clientID}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;