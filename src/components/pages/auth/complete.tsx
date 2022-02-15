import { FC, Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserData } from "../../../models/user-data";
import { userDataSelector } from "../../../redux/store";
import { Navigate } from 'react-router-dom';
import { PATH_ADMIN_ORDERS_LIST, PATH_INDEX, PATH_PROFILE } from "../../../config/routing";

const RedirectPage: FC = () => {

    const userData: UserData = useSelector(userDataSelector);
    const [redirectPath, setRedirectPath] = useState<string>();

    console.log("redirect page");
    console.log(userData);
    

    useEffect( () => {
        getNavigatePath().then(path => setRedirectPath(path))
    }, [] )

    async function getNavigatePath(): Promise<string> {
        if (userData.isAdmin) { 
            // Admin is going to /admin/orders-list
            return PATH_ADMIN_ORDERS_LIST;
        } else {
            // New user is going to /profile, old users and guests are going to /index
            return userData.isFirstLogin ? PATH_PROFILE : PATH_INDEX;
        }
    }

    return <Fragment>{redirectPath && <Navigate to={redirectPath} />}</Fragment>
}

export default RedirectPage;