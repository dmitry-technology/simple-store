import React, { FC, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { EmailVerify } from '../../../models/auth-types';
import { authService } from '../../../config/servicesConfig';


function getAlertType(auth: EmailVerify): {type: any, message: string} {
    switch (auth) {
        case EmailVerify.IN_PROGRESS: return {type: 'info', message: 'Checking credentials...'};
        case EmailVerify.ERROR: return {type: 'error', message: 'Wrong credentials.'};
        default: return {type: 'info', message: 'Checking credentials...'};
    }
}

const EmailVerification: FC = () => {
    const [loginStatus, setLoginStatus] = useState<EmailVerify>(EmailVerify.IN_PROGRESS);

    useEffect( () => {
        authService.verifyEmail(window.location.href).then(res => {res === EmailVerify.ERROR && setLoginStatus(res)});
    }, [] )    

    return  <React.Fragment>
                <Alert severity={getAlertType(loginStatus).type} sx={{mb: 2}}>
                    {getAlertType(loginStatus).message}
                </Alert>
            </React.Fragment>;
}

export default EmailVerification;
