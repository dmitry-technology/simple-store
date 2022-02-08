import { from, of, Observable } from "rxjs";
import { mergeMap } from 'rxjs/operators';
import AuthService from "./auth-service";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, sendSignInLinkToEmail, signOut, User } from "firebase/auth";
import { authState } from 'rxfire/auth';
import fireApp from "../../config/firebase-config";
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { nonAuthorisedUser, UserData } from "../../models/user-data";
import { LoginData, LoginType } from "../../models/login-data";
import AuthErrorType from "../../models/auth-error-types";

const providersList = new Map([
    ["Google", { service: GoogleAuthProvider }],
    ["Twitter", { service: TwitterAuthProvider }],
    ["Facebook", { service: FacebookAuthProvider }]
]);

const actionCodeSettings = {
    url: 'http://localhost:3000/login/verify',
    handleCodeInApp: true,
    dynamicLinkDomain: 'backlinkb7.page.link'
};

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(fireApp);


    constructor(private adminEmail: string) { }

    getUserData(): Observable<UserData> {
        return authState(this.auth).pipe(
            mergeMap(user => (
                !!user
                    ? from(this.getUser(user))
                    : of(nonAuthorisedUser)
            ))
        )
    }

    private async getUser(user: User) {
        return {
            userName: user.uid,
            displayName: (user.displayName || user.email!),
            isAdmin: user.email === this.adminEmail
        };
    }

    private loginWithPassword(loginData: LoginData): Promise<AuthErrorType> {
        return signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
                .then(() => AuthErrorType.NO_ERROR)
                .catch(() => AuthErrorType.INVALID_CREDENTIAL);
    }

    private loginWithEmailLink(loginData: LoginData): Promise<AuthErrorType> {
        return sendSignInLinkToEmail(this.auth, loginData.email, actionCodeSettings)
                .then(() => {
                    window.localStorage.setItem('emailForSignIn', loginData.email);
                    return AuthErrorType.AWAITING_CONFIRMATION;
                })
                .catch((error) => {
                    window.localStorage.removeItem('emailForSignIn');
                    const errorCode = error.code;
                    return (errorCode === 'auth/invalid-email') ? AuthErrorType.INVALID_EMAIL : AuthErrorType.SERVER_UNAVAILABLE
                });
    }

    private loginWithSocialProvider(loginData: LoginData): Promise<AuthErrorType> {
        const currentProvider = providersList.get(loginData.email)
                return signInWithPopup(this.auth, new currentProvider!.service())
                    .then(() => AuthErrorType.NO_ERROR)
                    .catch(() => AuthErrorType.INVALID_CREDENTIAL);
    }


    async login(loginData: LoginData): Promise<AuthErrorType> {
        switch (loginData.loginType) {
            case LoginType.WITH_PASSWORD: return this.loginWithPassword(loginData);
            case LoginType.WITH_EMAIL_LINK: return this.loginWithEmailLink(loginData);
            case LoginType.WITH_SOCIAL_PROVIDER: return this.loginWithSocialProvider(loginData);
            default: return AuthErrorType.SERVER_UNAVAILABLE;
        }
    }

    async logout(): Promise<boolean> {
        try {
            await signOut(this.auth);
            return true;
        } catch {
            return false;
        }
    }
}