import { Box } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { clientStore } from '../../config/servicesConfig';
import { UserData } from '../../models/user-data';
import { userDataSelector } from '../../redux/store';

const Profile: FC = () => {

    const userData: UserData = useSelector(userDataSelector);

    console.log("id: " + userData.id);
    console.log("email: " + userData.email);
    console.log("name: " + userData.name);
    console.log("isAdmin: " + userData.isAdmin);
    

    return  <Box>
                Profile page
            </Box>;
}
 
export default Profile;