import { FC, useEffect } from 'react';
import { getAdditionalUserInfo, getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const EmailVerify: FC = () => {
    const auth = getAuth();
    useEffect( () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            console.log("2");

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
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                });
        }
    }, [] )    

    // return <Navigate to={PATH_INDEX} />;
    return <div>Email Link Verification</div>;
}

export default EmailVerify;