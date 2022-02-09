import { Observable, of } from "rxjs";
import AuthErrorType, { EmailVerify } from "../../models/auth-types";
import { LoginData } from "../../models/login-data";
import { UserData } from "../../models/user-data";
import AuthService from "./auth-service";

export default class AuthServiceFake implements AuthService {

    verifyEmail(link: string): Promise<EmailVerify>  {
        return Promise.resolve(EmailVerify.SUCCESS);
    }

    getUserData(): Observable<UserData> {
        return of({id: 'admin' ,email: 'admin@tel-ran.co.il', name: 'Admin', isAdmin: true});
    }

    login(loginData: LoginData): Promise<AuthErrorType> {
        return Promise.resolve(AuthErrorType.NO_ERROR);
    }

    logout() {
        Promise.resolve(true);
    }
    
}