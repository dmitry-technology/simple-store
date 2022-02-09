import { Observable } from 'rxjs'
import AuthErrorType, { EmailVerify } from '../../models/auth-types';
import { LoginData } from '../../models/login-data';
import { UserData } from '../../models/user-data';

export default interface AuthService {
    getUserData(): Observable<UserData>;
    login(loginData: LoginData): Promise<AuthErrorType>;
    verifyEmail(link: string): Promise<EmailVerify> ;
    logout(): void;
}