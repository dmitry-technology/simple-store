import { FC } from 'react';
import { LoginData } from '../../../models/login-data';
import LoginForm from '../../UI/login-from';
import { authService } from '../../../config/servicesConfig';
import AuthErrorType from '../../../models/auth-types';

const Login: FC = () => {

    async function login(loginData: LoginData): Promise<AuthErrorType> {
        return await authService.login(loginData);
    }

    return  <LoginForm loginFn={login}></LoginForm>;
}
 
export default Login;