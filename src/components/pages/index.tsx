import { Box, Link } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { UserData } from '../../models/user-data';
import { userDataSelector } from '../../redux/store';

const Index: FC = () => {

    const userData: UserData = useSelector(userDataSelector);

    return  <Box>
                Index page {userData.displayName}
                <Link href='/logout'>logout</Link>
            </Box>;
}
 
export default Index;