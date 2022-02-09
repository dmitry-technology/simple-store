import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_INDEX } from '../../../config/routing';
import { authService } from '../../../config/servicesConfig';
import { nonAuthorisedUser } from '../../../models/user-data';
import { setUserData } from '../../../redux/actions';

const Logout: FC = () => {
    
    const dispatch = useDispatch();

    async function exit() {
        return await authService.logout();
    }
    
    useEffect( () => {
        exit().then( () => {
            dispatch(setUserData(nonAuthorisedUser));
            <Navigate to={PATH_INDEX} />
        });
    } )

    return <div></div>;
}
 
export default Logout;