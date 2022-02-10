import { Label } from '@mui/icons-material';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import { FC, Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { clientStore } from '../../config/servicesConfig';
import { DeliveryAddress, UserData } from '../../models/user-data';
import { userDataSelector } from '../../redux/store';
import { isEmailValid, isPhoneNumberValid } from '../../utils/common/validation-utils';
import AddressForm from '../UI/common/address-form';

const Profile: FC = () => {

    const userData: UserData = useSelector(userDataSelector);
    const [profileError, setProfileError] = useState({name: '', email: '', phone: '', address: ''});
    const [isValid, setValid] = useState<boolean>(false);
    const [newUserData, setNewUserData] = useState<UserData>(userData)

    useEffect(() => {
        validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUserData, profileError]);

    // Validation
    function validate() {
        const userNameValid: boolean = !!newUserData.name;
        const emailValid: boolean = isEmailValid(newUserData.email);
        const phoneValid: boolean = isPhoneNumberValid(newUserData.phoneNumber);
        const addressValid: boolean =  (!newUserData.deliveryAddress?.street && !newUserData.deliveryAddress?.house);
        setValid(userNameValid && emailValid && phoneValid && addressValid);
        // setProfileError({
        //     name: userNameValid ? '' : 'Enter your name',
        //     email: emailValid ? '' : 'Incorrect email',
        //     phone: phoneValid ? '' : 'Invalid phone number',
        //     address: addressValid ? '' : 'Fill in the delivery address'
        // })
    }
    
    // Handlers (saving data to tmp object)
    function nameHamdler(event: any) {
        newUserData.name = event.target.value;
        setNewUserData({...newUserData});
    }

    function emailHamdler(event: any) {
        newUserData.email = event.target.value;
        setNewUserData({...newUserData});
    }

    function phoneHamdler(event: any) {
        newUserData.phoneNumber = event.target.value;
        console.log("num: " + newUserData.phoneNumber);
        
        setNewUserData({...newUserData});
    }

    function addressHandler(address: DeliveryAddress) {
        newUserData.deliveryAddress = address;
        setNewUserData({...newUserData});
    }

    return  <Fragment>
                <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}} >
                    <Typography variant='h5'>Profile</Typography>
                            <TextField  label="Name" 
                                        value={newUserData.name} 
                                        placeholder={`Enter your name`} 
                                        type={"text"} 
                                        error={!!profileError.name} 
                                        required 
                                        onChange={nameHamdler} 
                                        helperText={profileError.name}>
                            </TextField>
                            <TextField  label="Email" 
                                        value={newUserData.email} 
                                        placeholder={`Enter your email-address`} 
                                        type={"email"} 
                                        error={!!profileError.email} 
                                        required 
                                        onChange={emailHamdler} 
                                        helperText={profileError.email}>
                            </TextField>
                            <TextField  label="Phone" 
                                        value={newUserData.phoneNumber} 
                                        placeholder={`Enter your phone number`} 
                                        type={"tel"} 
                                        error={!!profileError.phone} 
                                        required 
                                        onChange={phoneHamdler} 
                                        helperText={profileError.phone}>
                            </TextField>
                </Box>
                <Box>
                <Typography variant='h5'>Delivery address</Typography>
                    <AddressForm userData={userData} callBack={addressHandler} />
            </Box>
        </Fragment>;
}
 
export default Profile;