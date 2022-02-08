import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_INDEX } from '../../../config/routing';
import { authService } from '../../../config/servicesConfig';
import { nonAuthorisedUser, UserData } from '../../../models/user-data';
import { setUserData } from '../../../redux/actions';
import { userDataSelector } from '../../../redux/store';

const Logout: FC = () => {
    
    const dispatch = useDispatch();
    const userData: UserData = useSelector(userDataSelector);

    async function exit() {
        return await authService.logout();
    }
    
    useEffect( () => {
        exit();
        dispatch(setUserData(nonAuthorisedUser));
        console.log("name: " + userData.displayName);
        <Navigate to={PATH_INDEX} />
    } )

    return <div></div>;
}
 
export default Logout;