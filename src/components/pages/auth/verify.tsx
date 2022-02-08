import React, { FC, useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Alert } from '@mui/material';

const EmailVerify: FC = () => {
    const auth = getAuth();

    const [loginStatus, setLoginStatus] = useState<boolean>(false);

    useEffect( () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            signInWithEmailLink(auth, email!, window.location.href)
                .then((result) => {
                    console.log("result:" + result);
                    window.localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch((error) => {
                    console.log("error: " + error);
                });
        }
    }, [] )    

    return  <React.Fragment>
                {/* <Alert severity={loginErrMsg === getAuthErrorMessage(AuthErrorType.AWAITING_CONFIRMATION) ? 'success' : 'error'} sx={{mb: 2}}>{loginErrMsg}</Alert> */}
            </React.Fragment>;
}

export default EmailVerify;