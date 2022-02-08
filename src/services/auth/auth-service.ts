import { Observable } from 'rxjs'
import AuthErrorType from '../../models/auth-error-types';
import { LoginData } from '../../models/login-data';
import { UserData } from '../../models/user-data';

export default interface AuthService {
    getUserData(): Observable<UserData>;
    login(loginData: LoginData): Promise<AuthErrorType>;
    logout(): Promise<boolean>;
}