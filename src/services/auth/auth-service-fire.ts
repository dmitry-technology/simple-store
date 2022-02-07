import { from, of, Observable } from "rxjs";
import { mergeMap } from 'rxjs/operators';
import AuthService from "./auth-service";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { authState } from 'rxfire/auth';
import fireApp from "../../config/firebase-config";
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { nonAuthorisedUser, UserData } from "../../models/user-data";
import { LoginData } from "../../models/login-data";

const providersList = new Map([
    ["Google", {service: GoogleAuthProvider}],
    ["Twitter", {service: TwitterAuthProvider}],
    ["Facebook", {service: FacebookAuthProvider}]
  ]);

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(fireApp);

    constructor(private adminEmail: string) {}

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

    async login(loginData: LoginData): Promise<boolean> {
        if (!!loginData.email && !!loginData.password) {
            return signInWithEmailAndPassword(this.auth, loginData.email, loginData.password).then( () => true ).catch( () => false );
        } else {
            const currentProvider = providersList.get(loginData.email)
            if (currentProvider) {
                return signInWithPopup(this.auth, new currentProvider.service()).then( () => true ).catch( () => false );
            } else {
                return false;
            }
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