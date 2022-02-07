import { FC } from 'react';
import { LoginData } from '../../models/login-data';
import LoginForm from '../UI/login-from';
import { authService } from '../../config/servicesConfig';

const Login: FC = () => {

    async function login(loginData: LoginData): Promise<boolean> {
        return await authService.login(loginData);
    }

    return  <LoginForm loginFn={login}></LoginForm>;
}
 
export default Login;