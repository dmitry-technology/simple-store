import { FC } from "react";
import { useSelector } from "react-redux";
import { UserData } from "../../../models/user-data";
import { userDataSelector } from "../../../redux/store";
import { Navigate } from 'react-router-dom';
import { PATH_ADMIN_ORDERS_LIST, PATH_INDEX, PATH_PROFILE } from "../../../config/routing";

const RedirectPage: FC = () => {

    const userData: UserData = useSelector(userDataSelector);

    function getNavigatePath(): string {
        if (userData.isAdmin) { 
            // Admin is going to /admin/orders-list
            return PATH_ADMIN_ORDERS_LIST;
        } else {
            // Check user data for select path
            if (!!userData.id) {

                return PATH_PROFILE;
            } 
            // Guest is going to /
            return PATH_INDEX;
        }
    }

    return <Navigate to={getNavigatePath()} />;
}

export default RedirectPage;