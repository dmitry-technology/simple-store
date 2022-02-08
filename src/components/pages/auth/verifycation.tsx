import React, { FC, useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Alert } from '@mui/material';

enum Status {
    IN_PROGRESS = '123', 
    SUCCESS = '333', 
    ERROR = '443'
}

function getAlertType(auth: Status): {type: any, message: string} {
    switch (auth) {
        case Status.IN_PROGRESS: return {type: 'info', message: 'Checking credentials...'};
        case Status.SUCCESS: return {type: 'success', message: 'Successful authorization!'};
        case Status.ERROR: return {type: 'error', message: 'Wrong credentials.'};
        default: return {type: 'info', message: 'Checking credentials...'};
    }
}

const EmailVerifycation: FC = () => {
    const auth = getAuth();
    const [loginStatus, setLoginStatus] = useState<Status>(Status.IN_PROGRESS);

    useEffect( () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            signInWithEmailLink(auth, email!, window.location.href)
                .then(() => {
                    setLoginStatus(Status.SUCCESS)
                    window.localStorage.removeItem('emailForSignIn');
                })
                .catch(() => {
                    setLoginStatus(Status.ERROR);
                });
        }
    }, [] )    

    return  <React.Fragment>
                <Alert severity={getAlertType(loginStatus).type} sx={{mb: 2}}>
                    {getAlertType(loginStatus).message}
                </Alert>
            </React.Fragment>;
}

export default EmailVerifycation;