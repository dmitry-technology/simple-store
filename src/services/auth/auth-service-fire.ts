import { from, of, Observable } from "rxjs";
import { mergeMap} from 'rxjs/operators';
import AuthService from "./auth-service";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, sendSignInLinkToEmail, signOut, User, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { authState } from 'rxfire/auth';
import fireApp from "../../config/firebase-config";
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { emptyAddress, nonAuthorisedUser, UserData } from "../../models/user-data";
import { LoginData, LoginType } from "../../models/login-data";
import AuthErrorType, { EmailVerify } from "../../models/auth-types";
import { collection, CollectionReference, doc, getDoc, getFirestore } from "firebase/firestore";

// Available social login providers
const providersList = new Map([
    ["Google", { service: GoogleAuthProvider }],
    ["Twitter", { service: TwitterAuthProvider }],
    ["Facebook", { service: FacebookAuthProvider }]
]);

// Callback URL for verify email-link
const actionCodeSettings = {
    url: 'http://localhost:3000/login/verify',
    handleCodeInApp: true,
    dynamicLinkDomain: 'backlinkb7.page.link'
};

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(fireApp);
    private collectionAuth: CollectionReference;

    constructor(private adminEmail: string, private usersCollection: string) {
        this.collectionAuth = collection(getFirestore(fireApp), this.usersCollection);
    }

    async verifyEmailLoginLink(link: string): Promise<EmailVerify> {
        if (isSignInWithEmailLink(this.auth, link)) {
            const email = window.localStorage.getItem('emailForSignIn');
            try {
                await signInWithEmailLink(this.auth, email!, link);
                window.localStorage.removeItem('emailForSignIn');
                return EmailVerify.SUCCESS;
            } catch (err) {
                return EmailVerify.ERROR;
            }
        } else {
            return EmailVerify.ERROR;
        }
    }

    getUserData(): Observable<UserData> {
        return authState(this.auth).pipe(
            mergeMap(user => (
                !!user
                    ? from(this.getUser(user))
                    : of(nonAuthorisedUser)
            ))
        )
    }

    private async getUser(userFire: User) {
        // Get information about the User from Firesitore
        const clientData = (await getDoc(doc(this.collectionAuth, userFire?.uid ))).data() as UserData | undefined;
        
        const baseData: UserData = {
            id: userFire.uid,
            email: userFire.email ? userFire.email : '',
            name: userFire.displayName ? userFire.displayName : '',
            phoneNumber: userFire.phoneNumber ? userFire.phoneNumber : '',
            photoURL: userFire.photoURL ? userFire.photoURL : '',
            deliveryAddress: emptyAddress,
            isAdmin: userFire.email === this.adminEmail,
            isFirstLogin: !clientData
        };

        // Create UserData with new information
        if (clientData) {
            return {...baseData, 
                        name: clientData.name ? clientData.name : baseData.name,
                        phoneNumber: clientData.phoneNumber ? clientData.phoneNumber : baseData.phoneNumber,
                        deliveryAddress: clientData.deliveryAddress ? clientData.deliveryAddress : baseData.deliveryAddress
            }
        } else {
            // Return object just with base information from User
            return baseData;
        }
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

    async logout() {
        try {
            await signOut(this.auth);
        } catch(err) {
            console.log("catch" + err);
        }
    }
}