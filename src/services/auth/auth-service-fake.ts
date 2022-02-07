import { Observable, of } from "rxjs";
import { LoginData } from "../../models/login-data";
import { UserData } from "../../models/user-data";
import AuthService from "./auth-service";

export default class AuthServiceFake implements AuthService {

    getUserData(): Observable<UserData> {
        return of({userName: 'admin@tel-ran.co.il', displayName: 'Admin', isAdmin: true});
    }

    login(loginData: LoginData): Promise<boolean> {
        return Promise.resolve(true);
    }

    logout(): Promise<boolean> {
        return Promise.resolve(true);
    }
    
}