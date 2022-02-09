import { FC, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../../models/user-data";
import { userDataSelector } from "../../../redux/store";
import { Navigate } from 'react-router-dom';
import { PATH_ADMIN_ORDERS_LIST, PATH_INDEX, PATH_PROFILE } from "../../../config/routing";
import { clientStore } from "../../../config/servicesConfig";
import { setUserData } from "../../../redux/actions";

const RedirectPage: FC = () => {

    const userData: UserData = useSelector(userDataSelector);
    const [redirectPath, setRedirectPath] = useState<string>();
    const dispatch = useDispatch();

    useEffect( () => {
        getNavigatePath().then(path => setRedirectPath(path))
    }, [] )

    async function getNavigatePath(): Promise<string> {
        if (userData.isAdmin) { 
            // Admin is going to /admin/orders-list
            return PATH_ADMIN_ORDERS_LIST;
        } else {
            // Check user data for select path
            if (!!userData.id) {
                 const data = await clientStore.get(userData.id);
                 if (data) {
                    // Old user - get data from Firestore
                    dispatch(setUserData(data));
                    return PATH_INDEX;
                } else { 
                    // User created just now - saving data to Firestore
                    delete userData.isAdmin;
                    clientStore.add({...userData});
                    return PATH_PROFILE;
                }
            } else {
                // Guest is going to /
                return PATH_INDEX;
            }
        }
    }

    return <Fragment>{redirectPath && <Navigate to={redirectPath} />}</Fragment>
}

export default RedirectPage;